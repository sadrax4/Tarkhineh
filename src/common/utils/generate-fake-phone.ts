import * as crypto from "crypto";
export const generateFakePhone = (): string => crypto.randomInt(10000000000, 99999999999).toString();
