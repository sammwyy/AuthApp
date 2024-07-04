"use client";

import useAuth from "@/hooks/use-auth";
import useData from "@/hooks/use-data";
import {
  decryptWithKey,
  decryptWithPin,
  encryptWithPin,
} from "@/lib/cipherUtils";
import React, { PropsWithChildren, useEffect } from "react";
import { EncryptionHook } from "./encryption-hook";

export const EncryptionContext = React.createContext<EncryptionHook>({
  decrypt: async () => "",
  decryptionKey: null,
  encrypt: async () => "",
  encryptionKey: null,
  isPinSetup: false,
  isUnlocked: false,
  setPin: () => {},
  unlock: () => {},
});

export const EncryptionProvider = ({ children }: PropsWithChildren) => {
  const { logged } = useAuth();
  const { profile } = useData();

  const [encryptionKey, setEncryptionKey] = React.useState<string | null>(null);
  const [decryptionKey, setDecryptionKey] = React.useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = React.useState(false);
  const [isPinSetup, setIsPinSetup] = React.useState(false);

  const decrypt = async (data: string) => {
    if (!decryptionKey) throw new Error("Decryption key not set");
    return decryptWithKey(data, decryptionKey);
  };

  const encrypt = async (data: string) => {
    if (!encryptionKey) throw new Error("Encryption key not set");
    return decryptWithKey(data, encryptionKey);
  };

  const setPin = async (pin: string) => {
    if (!encryptionKey || !decryptionKey) return;
    const secureEncryptionKey = await encryptWithPin(pin, encryptionKey);
    const secureDecryptionKey = await encryptWithPin(pin, decryptionKey);

    localStorage.setItem("secure_encryption_key", secureEncryptionKey);
    localStorage.setItem("secure_decryption_key", secureDecryptionKey);
    setIsPinSetup(true);
  };

  const unlock = async (pin: string) => {
    const secureEncryptionKey = localStorage.getItem("secure_encryption_key");
    const secureDecryptionKey = localStorage.getItem("secure_decryption_key");
    if (!secureEncryptionKey || !secureDecryptionKey) return;

    const encryptionKey = await decryptWithPin(pin, secureEncryptionKey);
    const decryptionKey = await decryptWithPin(pin, secureDecryptionKey);

    setEncryptionKey(encryptionKey);
    setDecryptionKey(decryptionKey);
    setIsUnlocked(true);

    sessionStorage.setItem("session_encryption_key", encryptionKey);
    sessionStorage.setItem("session_decryption_key", decryptionKey);
  };

  useEffect(() => {
    const initKeys = async (password: string) => {
      if (!profile) return;

      const decryptionKey = await decryptWithPin(
        password,
        profile.decryption_key
      );

      const encryptionKey = await decryptWithPin(
        password,
        profile.encryption_key
      );

      setDecryptionKey(decryptionKey);
      setEncryptionKey(encryptionKey);
    };

    if (logged && profile) {
      const tempPassword = sessionStorage.getItem("last_used_password");
      if (tempPassword) {
        initKeys(tempPassword);
      }

      if (localStorage.getItem("secure_encryption_key")) {
        setIsPinSetup(true);
      }

      if (sessionStorage.getItem("session_encryption_key")) {
        setDecryptionKey(sessionStorage.getItem("session_decryption_key"));
        setEncryptionKey(sessionStorage.getItem("session_encryption_key"));
        setIsUnlocked(true);
      }
    }
  }, [logged, profile]);

  return (
    <EncryptionContext.Provider
      value={{
        encryptionKey,
        decryptionKey,
        isUnlocked,
        isPinSetup,
        encrypt,
        decrypt,
        setPin,
        unlock,
      }}
    >
      {children}
    </EncryptionContext.Provider>
  );
};
