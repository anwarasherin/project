from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding, serialization, hashes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.kdf.hkdf import HKDF

import os
import hashlib
import base64
import json

def save_to_disk(filename,content):
        file_location = f"uploaded_files/{filename}"
        with open(file_location, "wb") as f:
            f.write(content)

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

def generate_ecc_private_and_public_keys():
        # Generate private key
        private_key = ec.generate_private_key(ec.SECP256R1())

        # Derive the public key
        public_key = private_key.public_key()

        # Serialize the private key (PEM format)
        pem_private_key = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.TraditionalOpenSSL,
            encryption_algorithm=serialization.NoEncryption()  # No encryption
        )

        # Serialize the public key (PEM format)
        pem_public_key = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )

        # Send the private key securely (via HTTPS, encrypted email, etc.)
        # Send the public key openly (it can be printed, uploaded to a server, etc.)

        print("Private Key:")
        print(pem_private_key.decode())

        print("\nPublic Key:")
        print(pem_public_key.decode())




def encrypt_key_with_ecc(block: dict, pem_public_key: str) -> str:
    """Encrypts a blockchain block using ECC and the recipient's public key."""
    # Convert the block dictionary to a JSON string
    block_json = json.dumps(block)

    # Load the public key from PEM
    public_key = serialization.load_pem_public_key(pem_public_key.encode())

    # Perform ECDH with a pre-defined static key (for simplicity)
    private_key = ec.generate_private_key(ec.SECP256R1())
    shared_secret = private_key.exchange(ec.ECDH(), public_key)

    # Derive a symmetric key from the shared secret using HKDF
    derived_key = HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=None,
        info=b"blockchain encryption"
    ).derive(shared_secret)

    # Encrypt the block using XOR for demonstration purposes
    encrypted_data = bytes(a ^ b for a, b in zip(block_json.encode(), derived_key[:len(block_json)]))

    # Return base64-encoded ciphertext for safe storage or transmission
    return base64.b64encode(encrypted_data).decode()