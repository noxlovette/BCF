from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes, serialization
from dotenv import load_dotenv
import os

load_dotenv()

PRIVATE_KEY_PASSWORD = os.getenv('PRIVATE_KEY_PASSWORD')
PUBLIC_KEY = os.getenv('PUBLIC_KEY')
PRIVATE_KEY = os.getenv('PRIVATE_KEY')

def get_private_key():
    private_key_text = PRIVATE_KEY
    return serialization.load_pem_private_key(
        private_key_text.encode(),
        password=PRIVATE_KEY_PASSWORD.encode() if PRIVATE_KEY_PASSWORD else None,
        backend=default_backend()
    )

def get_public_key():
    public_key_text = PUBLIC_KEY
    return serialization.load_pem_public_key(
        public_key_text.encode(),
        backend=default_backend()
    )

def decrypt_field(encrypted):
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

def encrypt_field(data):
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