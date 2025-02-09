from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec

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
