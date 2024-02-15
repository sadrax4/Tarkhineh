import * as crypto from "crypto";
export const discountCode = () => {
    return crypto.randomBytes(5).toString('base64url');
}