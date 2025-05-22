/**
 * Transforms cookie sameSite values to be compatible with Puppeteer
 * @param {Array} cookies - Array of cookie objects
 * @returns {Array} - Transformed cookies array
 */
export function parseCookies(cookies) {
    return cookies.map(cookie => {
        // Create a new cookie object to avoid mutating the original
        const parsedCookie = { ...cookie };

        // Transform sameSite values
        if (parsedCookie.sameSite === 'no_restriction' || parsedCookie.sameSite === null) {
            parsedCookie.sameSite = 'None';
        } else if (parsedCookie.sameSite === 'lax') {
            parsedCookie.sameSite = 'Lax';
        } else if (parsedCookie.sameSite === 'strict') {
            parsedCookie.sameSite = 'Strict';
        }

        // Ensure secure is true when sameSite is None
        if (parsedCookie.sameSite === 'None') {
            parsedCookie.secure = true;
        }

        return parsedCookie;
    });
}

// Example usage:
/*
import { cookies } from '../test/cookies.js';
import { parseCookies } from '../utils/cookieParser.js';

const parsedCookies = parseCookies(cookies);
*/ 