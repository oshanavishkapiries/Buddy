import Cookie from '../models/Cookies.js';

export const createCookie = async (userId, provider, cookies) => {
    const cookie = await Cookie.create({ userId, provider, cookies });
    return cookie;
};

export const getCookie = async (userId, provider) => {
    const cookie = await Cookie.findOne({ userId, provider });
    return cookie;
};2