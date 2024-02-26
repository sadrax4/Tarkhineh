import * as basicAuth from "express-basic-auth"
export function basicAuthorize() {
    return basicAuth({
        challenge: true,
        users: {
            sadra: "123456",
        }
    })
}