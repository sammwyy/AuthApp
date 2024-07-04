import { EncryptionContext } from "@/contexts/encryption";
import { useContext } from "react";

const useEncryption = () => useContext(EncryptionContext);

export default useEncryption;
