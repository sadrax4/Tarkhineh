import * as crypto from "crypto";
export const dicountCodeGenerator = () => {
    return crypto.randomBytes(4).toString('hex');
}