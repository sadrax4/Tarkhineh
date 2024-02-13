import * as crypto from "crypto";
export const generateOtpCode = (): number => crypto.randomInt(10000000000, 99999999999);
