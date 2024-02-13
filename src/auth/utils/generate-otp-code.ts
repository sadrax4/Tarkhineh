import * as crypto from "crypto";
crypto.randomInt(1000,9999);
export const generateOtpCode = (): number => crypto.randomInt(4);

//number => Math.floor(Math.random() * 90000) + 10000;