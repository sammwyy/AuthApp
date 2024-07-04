export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export async function generateKeyPair(): Promise<KeyPair> {
  const { publicKey, privateKey } = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const publicKeyBuffer = await crypto.subtle.exportKey("spki", publicKey);
  const privateKeyBuffer = await crypto.subtle.exportKey("pkcs8", privateKey);

  const publicKeyBase64 = btoa(
    String.fromCharCode(...new Uint8Array(publicKeyBuffer))
  );
  const privateKeyBase64 = btoa(
    String.fromCharCode(...new Uint8Array(privateKeyBuffer))
  );

  return { publicKey: publicKeyBase64, privateKey: privateKeyBase64 };
}

export async function encryptWithKey(
  key: string,
  data: string
): Promise<string> {
  const keyBuffer = new Uint8Array(
    atob(key)
      .split("")
      .map((char) => char.charCodeAt(0))
  );

  const publicKey = await crypto.subtle.importKey(
    "spki",
    keyBuffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    new TextEncoder().encode(data)
  );

  return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
}

export async function decryptWithKey(
  key: string,
  data: string
): Promise<string> {
  const keyBuffer = new Uint8Array(
    atob(key)
      .split("")
      .map((char) => char.charCodeAt(0))
  );

  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    keyBuffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    new Uint8Array(
      atob(data)
        .split("")
        .map((char) => char.charCodeAt(0))
    )
  );

  return new TextDecoder().decode(decryptedBuffer);
}

export async function encryptWithPin(
  pin: string,
  data: string
): Promise<string> {
  const pinBuffer = new TextEncoder().encode(pin);
  const pinHashBuffer = await crypto.subtle.digest("SHA-256", pinBuffer);

  const pinHash = new Uint8Array(pinHashBuffer);
  const pinKey = await crypto.subtle.importKey(
    "raw",
    pinHash,
    {
      name: "AES-GCM",
    },
    false,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    pinKey,
    new TextEncoder().encode(data)
  );

  const encrypted = btoa(
    String.fromCharCode(...new Uint8Array(encryptedBuffer))
  );
  const ivBase64 = btoa(String.fromCharCode(...iv));

  return `${ivBase64}.${encrypted}`;
}

export async function decryptWithPin(
  pin: string,
  data: string
): Promise<string> {
  const [ivBase64, encrypted] = data.split(".");
  const iv = new Uint8Array(
    atob(ivBase64)
      .split("")
      .map((char) => char.charCodeAt(0))
  );

  const pinBuffer = new TextEncoder().encode(pin);
  const pinHashBuffer = await crypto.subtle.digest("SHA-256", pinBuffer);

  const pinHash = new Uint8Array(pinHashBuffer);
  const pinKey = await crypto.subtle.importKey(
    "raw",
    pinHash,
    {
      name: "AES-GCM",
    },
    false,
    ["decrypt"]
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    pinKey,
    new Uint8Array(
      atob(encrypted)
        .split("")
        .map((char) => char.charCodeAt(0))
    )
  );

  return new TextDecoder().decode(decryptedBuffer);
}
