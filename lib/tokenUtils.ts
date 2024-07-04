import { TOTP } from "totp-generator";

export function getTOTP(key: string) {
  const { otp } = TOTP.generate(key);
  return otp;
}
