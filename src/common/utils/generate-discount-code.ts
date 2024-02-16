import * as crypto from "crypto";
export const discountCode = () => {
    return crypto.randomBytes(8).toString('base64url');
}