import * as basicAuth from "express-basic-auth"
function myAuthorizer(username, password) {
    const userMatches = basicAuth.safeCompare(username, 'customuser')
    const passwordMatches = basicAuth.safeCompare(password, 'custompassword')

    return userMatches && passwordMatches
}