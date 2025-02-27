from utils import generate_ecc_key_pair
import os

folder_path = "ecc_keys"  
os.makedirs(folder_path, exist_ok=True)

generate_ecc_key_pair()