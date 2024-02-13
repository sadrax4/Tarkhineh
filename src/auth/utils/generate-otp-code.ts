import * as crypto from "crypto";
export const generateOtpCode = (): number => crypto.randomInt(10000, 99999);
