from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes, serialization
from dotenv import load_dotenv
import os

load_dotenv()

PRIVATE_KEY_PASSWORD = os.getenv('PRIVATE_KEY_PASSWORD')
LICENSE_LOCATION = os.getenv('LICENSE_LOCATION')


def get_private_key():
    key_path = os.getenv('PRIVATE_KEY_PATH', '/Volumes/Thor/private_key.pem')
    with open(key_path, 'rb') as key_file:
        return serialization.load_pem_private_key(
            key_file.read(),
            # TODO HARDCODED PASSWORD
            password=os.getenv('PRIVATE_KEY_PASSWORD', PRIVATE_KEY_PASSWORD).encode(),
            backend=default_backend()
        )


def get_public_key():
    key_path = os.getenv('PUBLIC_KEY_PATH', LICENSE_LOCATION)
    with open(key_path, 'rb') as key_file:
        return serialization.load_pem_public_key(
            key_file.read(),
            backend=default_backend()
        )


def decrypt_field(self, encrypted):
    if encrypted:
        private_key = get_private_key()
        if isinstance(encrypted, memoryview):
            encrypted = encrypted.tobytes()
        decrypted = private_key.decrypt(
            encrypted,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        return decrypted.decode()
    return None


def encrypt_field(self, data):
    if data is not None:
        public_key = get_public_key()
        if isinstance(data, str):
            data = data.encode('utf-8')
        encrypted = public_key.encrypt(
            data,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        return encrypted
    return None
