import * as basicAuth from "express-basic-auth"
export function myAuthorizer(username: string, password: string) {

    const userMatches = basicAuth.safeCompare(username, 'customuser')
    const passwordMatches = basicAuth.safeCompare(password, 'custompassword')
    return userMatches && passwordMatches
}