// WebCrypto utilities for encrypting/decrypting API keys

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

/**
 * Generate a random encryption key and store it in IndexedDB
 */
export async function generateAppSecret(): Promise<CryptoKey> {
  const key = await crypto.subtle.generateKey(
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );

  // Store the key in IndexedDB for persistence
  const exported = await crypto.subtle.exportKey('jwk', key);
  localStorage.setItem('sora-app-secret', JSON.stringify(exported));

  return key;
}

/**
 * Retrieve the app secret from storage or generate a new one
 */
export async function getAppSecret(): Promise<CryptoKey> {
  const stored = localStorage.getItem('sora-app-secret');

  if (stored) {
    try {
      const jwk = JSON.parse(stored);
      return await crypto.subtle.importKey(
        'jwk',
        jwk,
        {
          name: ALGORITHM,
          length: KEY_LENGTH,
        },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.error('Failed to import stored key:', error);
      // Fall through to generate new key
    }
  }

  return generateAppSecret();
}

/**
 * Encrypt a string (e.g., API key) using AES-GCM
 */
export async function encryptString(plaintext: string): Promise<ArrayBuffer> {
  const key = await getAppSecret();
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  // Generate a random IV
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  // Encrypt the data
  const encrypted = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv,
    },
    key,
    data
  );

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  return combined.buffer;
}

/**
 * Decrypt an encrypted string
 */
export async function decryptString(encryptedData: ArrayBuffer): Promise<string> {
  const key = await getAppSecret();
  const data = new Uint8Array(encryptedData);

  // Extract IV and encrypted content
  const iv = data.slice(0, IV_LENGTH);
  const encrypted = data.slice(IV_LENGTH);

  // Decrypt the data
  const decrypted = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv,
    },
    key,
    encrypted
  );

  // Decode the decrypted data
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

/**
 * Wipe the app secret (user wants to reset)
 */
export function wipeAppSecret(): void {
  localStorage.removeItem('sora-app-secret');
}

/**
 * Derive a key from a user-provided passphrase (optional advanced feature)
 */
export async function deriveKeyFromPassphrase(passphrase: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passphraseData = encoder.encode(passphrase);

  // Import the passphrase as a key
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passphraseData,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive a key using PBKDF2
  const salt = encoder.encode('sora-renderer-salt'); // In production, use a random salt stored with the encrypted data
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

