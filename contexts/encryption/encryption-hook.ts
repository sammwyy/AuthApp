export interface EncryptionHook {
  isUnlocked: boolean;
  isPinSetup: boolean;

  encryptionKey: string | null;
  decryptionKey: string | null;

  encrypt: (data: string) => Promise<string>;
  decrypt: (data: string) => Promise<string>;
  setPin: (pin: string) => void;
  unlock: (pin: string) => void;
}
