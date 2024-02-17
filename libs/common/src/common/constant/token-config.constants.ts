import { CookieOptions } from "express"

export const AccessCookieConfig: CookieOptions = {
    sameSite: 'none',
    httpOnly: false,
    secure: true,
    maxAge: (1 * 3600 * 1000),
}

export const RefreshCookieConfig: CookieOptions = {
    sameSite: 'none',
    httpOnly: false,
    secure: true,
    maxAge: (3 * 3600 * 24 * 1000),
}