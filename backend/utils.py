from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding, serialization, hashes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives.serialization import load_pem_public_key

import os
import hashlib
import base64
import json

DB_FILE = "database.json"

def save_to_disk(filename,content):
        file_location = f"uploaded_files/{filename}"
        with open(file_location, "wb") as f:
            f.write(content)

def save_encrypted_data_to_file(encrypted_data, filename):
    file_location = f"uploaded_files/{filename}"
    with open(file_location, 'wb') as file:
        file.write(encrypted_data)

def read_encrypted_data_from_file(filename):
    file_location = f"uploaded_files/{filename}"
    with open(file_location, 'rb') as file:
        return file.read()

def encrypt_aes256(key: bytes, plaintext: bytes) -> bytes:
    iv = os.urandom(16)
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()

    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(plaintext) + padder.finalize()

    ciphertext = encryptor.update(padded_data) + encryptor.finalize()

    return iv + ciphertext


def decrypt_aes256(key: bytes, ciphertext: bytes) -> bytes:
    iv = ciphertext[:16]
    actual_ciphertext = ciphertext[16:]
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()

    decrypted_data = decryptor.update(actual_ciphertext) + decryptor.finalize()
    unpadder = padding.PKCS7(128).unpadder()
    
    plaintext = unpadder.update(decrypted_data) + unpadder.finalize()

    return plaintext

def calculate_hash(block):
    block_string = f"{block.index}{block.previous_hash}{block.timestamp}{block.data}"
    return hashlib.sha256(block_string.encode('utf-8')).hexdigest()

def compute_sha256(content: bytes) -> str:
    sha256_hash = hashlib.sha256()
    sha256_hash.update(content)
    return sha256_hash.hexdigest()

def xor_hashes(hash1: bytes, hash2: bytes) -> bytes:
    # Ensure both hashes are the same length (32 bytes for SHA-256)
    hash1_bytes = bytes.fromhex(hash1)
    hash2_bytes = bytes.fromhex(hash2)

    if len(hash1_bytes) != len(hash2_bytes):
        raise ValueError("The hashes must have the same length")
    
    xor_result = bytes([b1 ^ b2 for b1, b2 in zip(hash1_bytes, hash2_bytes)])
    return xor_result

def generate_ecc_key_pair():
    """Generate ECC private and public keys."""
    private_key = ec.generate_private_key(ec.SECP256R1(), default_backend())
    public_key = private_key.public_key()
    save_private_key(private_key=private_key,file_path="ecc_keys/ecc_private_key.pem")
    save_public_key(public_key=public_key,file_path="ecc_keys/ecc_public_key.pem")

def save_private_key(private_key, file_path):
    """Save the private key without password protection."""
    with open(file_path, "wb") as key_file:
        key_file.write(
            private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.TraditionalOpenSSL,
                encryption_algorithm=serialization.NoEncryption()
            )
        )
    print(f"Private key saved to {file_path}")

def save_public_key(public_key, file_path):
    """Save the public key."""
    with open(file_path, "wb") as key_file:
        key_file.write(
            public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            )
        )
    print(f"Public key saved to {file_path}")

def load_private_key(file_path):
    """Load a private key without password."""
    with open(file_path, "rb") as key_file:
        private_key = serialization.load_pem_private_key(
            key_file.read(),
            password=None
        )
    return private_key

def load_public_key(file_path):
    """Load a public key."""
    with open(file_path, "rb") as key_file:
        public_key = serialization.load_pem_public_key(
            key_file.read()
        )
    return public_key

def encrypt_dict(data_dict, public_key):
    """Encrypt a dictionary using ECC and AES."""
    # Serialize the dictionary
    data_bytes = json.dumps(data_dict).encode('utf-8')

    # Generate ephemeral key pair
    ephemeral_private_key = ec.generate_private_key(ec.SECP256R1(), default_backend())
    shared_secret = ephemeral_private_key.exchange(ec.ECDH(), public_key)

    # Derive a key from the shared secret
    derived_key = HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=None,
        info=b'encryption',
        backend=default_backend()
    ).derive(shared_secret)

    # Encrypt using AES-GCM
    iv = os.urandom(12)
    cipher = Cipher(algorithms.AES(derived_key), modes.GCM(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(data_bytes) + encryptor.finalize()

    return {
        "ephemeral_public_key": ephemeral_private_key.public_key().public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
),
        "iv": iv,
        "ciphertext": ciphertext,
        "tag": encryptor.tag
    }

def decrypt_dict(encrypted_data, private_key):
    """Decrypt a dictionary using ECC and AES."""
    # Extract components from encrypted data
    ephemeral_public_key = load_pem_public_key(encrypted_data["ephemeral_public_key"])
    iv = encrypted_data["iv"]
    ciphertext = encrypted_data["ciphertext"]
    tag = encrypted_data["tag"]

    # Generate shared secret
    shared_secret = private_key.exchange(ec.ECDH(), ephemeral_public_key)

    # Derive the key from the shared secret
    derived_key = HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=None,
        info=b'encryption',
        backend=default_backend()
    ).derive(shared_secret)

    # Decrypt using AES-GCM
    cipher = Cipher(algorithms.AES(derived_key), modes.GCM(iv, tag), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted_bytes = decryptor.update(ciphertext) + decryptor.finalize()

    # Deserialize the dictionary
    return json.loads(decrypted_bytes.decode('utf-8'))



# Helper functions
def read_db():
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, "w") as f:
            json.dump({"files": []}, f)
    
    with open(DB_FILE, "r") as f:
        return json.load(f)


def write_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=4)