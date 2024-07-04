import { TOTP } from "totp-generator";

export type TOTPAlgorithm =
  | "SHA-1"
  | "SHA-224"
  | "SHA-256"
  | "SHA-384"
  | "SHA-512"
  | "SHA3-224"
  | "SHA3-256"
  | "SHA3-384"
  | "SHA3-512";
export const TOTPAlgorithms: TOTPAlgorithm[] = [
  "SHA-1",
  "SHA-224",
  "SHA-256",
  "SHA-384",
  "SHA-512",
  "SHA3-224",
  "SHA3-256",
  "SHA3-384",
  "SHA3-512",
];

export function getTOTP(
  key: string,
  period: number,
  digits: number,
  algorithm: TOTPAlgorithm
) {
  const { otp } = TOTP.generate(key, {
    digits,
    algorithm,
    period,
  });
  return otp;
}
