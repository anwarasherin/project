import { ec } from "elliptic";
import { Buffer } from "buffer";
import crypto from "crypto";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Create a new EC instance with P-256 curve
let EC;

export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

export const initializeEC = () => {
  EC = new ec("p256");
};

export const generateECCKeyPairs = () => {
  const keyPair = EC.genKeyPair();

  const privateKeyHex = keyPair.getPrivate("hex");
  const publicKeyHex = keyPair.getPublic("hex");

  const privateKeyBuffer = Buffer.from(privateKeyHex, "hex");
  const publicKeyBuffer = Buffer.from(publicKeyHex, "hex");

  const privateKeyPEM = `-----BEGIN PRIVATE KEY-----\n${toBase64(
    privateKeyBuffer
  )}\n-----END PRIVATE KEY-----`;
  const publicKeyPEM = `-----BEGIN PUBLIC KEY-----\n${toBase64(
    publicKeyBuffer
  )}\n-----END PUBLIC KEY-----`;

  return { publicKeyPEM, privateKeyPEM };
};

// Convert to Base64 for PEM formatting
function toBase64(buffer) {
  return buffer
    .toString("base64")
    .match(/.{1,64}/g)
    .join("\n");
}

export function pemToECKey(pem, isPrivate = false) {
  const base64Key = pem
    .replace(/-----.*?KEY-----/g, "") // Remove PEM headers
    .replace(/\n/g, ""); // Remove newlines

  const keyBuffer = Buffer.from(base64Key, "base64");
  const hexKey = keyBuffer.toString("hex");

  return isPrivate
    ? EC.keyFromPrivate(hexKey, "hex")
    : EC.keyFromPublic(hexKey, "hex");
}

/**
 * AES Encryption using shared secret
 */
export function encryptAES(data, sharedSecret) {
  const key = crypto.createHash("sha256").update(sharedSecret).digest(); // Derive AES key
  const iv = crypto.randomBytes(12); // IV for AES-GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag(); // Get authentication tag for integrity

  return `${encrypted}.${iv.toString("base64")}.${authTag.toString("base64")}`;
}

/**
 * AES Decryption
 */
export function decryptAES(encryptedData, sharedSecret) {
  try {
    const [encrypted, iv, authTag] = encryptedData
      .split(".")
      .map((part) => Buffer.from(part, "base64"));

    const key = crypto.createHash("sha256").update(sharedSecret).digest();
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag); // Set authentication tag

    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (ex) {
    return false;
  }
}

/**
 * Encrypt a message using ECC public key
 */
export function encryptWithECC(publicKeyPEM, message) {
  const publicKey = pemToECKey(publicKeyPEM, false);
  console.log("ldmd");

  // Generate an ephemeral key pair
  const ephemeralKey = EC.genKeyPair();

  // Compute shared secret
  const sharedSecret = ephemeralKey.derive(publicKey.getPublic()).toString(16);

  // Encrypt message using AES
  const encryptedMessage = encryptAES(message, sharedSecret);

  // Return ephemeral public key (so recipient can derive the same shared secret)
  const ephemeralPublicKeyPEM = `-----BEGIN PUBLIC KEY-----\n${Buffer.from(
    ephemeralKey.getPublic("hex"),
    "hex"
  )
    .toString("base64")
    .match(/.{1,64}/g)
    .join("\n")}\n-----END PUBLIC KEY-----`;

  return { encryptedMessage, ephemeralPublicKeyPEM };
}

/**
 * Decrypt message using ECC private key
 */
export function decryptWithECC(
  privateKeyPEM,
  encryptedData,
  ephemeralPublicKeyPEM
) {
  const privateKey = pemToECKey(privateKeyPEM, true);

  if (!privateKey) return false;

  const ephemeralPublicKey = pemToECKey(ephemeralPublicKeyPEM, false);

  if (!ephemeralPublicKey) return false;

  // Compute shared secret
  const sharedSecret = privateKey
    .derive(ephemeralPublicKey.getPublic())
    .toString(16);

  console.log("ins 2");
  decryptAES(encryptedData, sharedSecret);
  console.log("ins 3");

  // Decrypt message using AES
  return decryptAES(encryptedData, sharedSecret);
}

export const sha256 = (message) => {
  return crypto.createHash("sha256").update(message).digest("hex");
};

export const xorShaHashes = (hex1, hex2) => {
  const buf1 = Buffer.from(hex1, "hex");
  const buf2 = Buffer.from(hex2, "hex");

  const length = Math.min(buf1.length, buf2.length);
  const result = Buffer.alloc(length);

  for (let i = 0; i < length; i++) {
    result[i] = buf1[i] ^ buf2[i];
  }

  return result.toString("hex");
};
