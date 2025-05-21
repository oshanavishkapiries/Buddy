import Cookie from '../models/Cookies.js';

export const createCookie = async (userId, provider, cookies) => {
    const cookie = await Cookie.create({
        user: userId,
        provider,
        cookies
    });
    return cookie;
};

export const updateCookie = async (userId, provider, cookies) => {
    const cookie = await Cookie.findOneAndUpdate({
        user: userId,
        provider
    }, { cookies });
    return cookie;
};

export const getCookie = async (userId, provider) => {
    const cookie = await Cookie.findOne({
        user: userId,
        provider
    });
    return cookie;
};

export const deleteCookie = async (userId, provider) => {
    const cookie = await Cookie.findOneAndDelete({
        user: userId,
        provider
    });
    return cookie;
};
