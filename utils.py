from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
import os
import hashlib

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
    return xor_result.hex()