import User from '../models/User.js';

export const createUser = async (userData) => {
    const user = await User.create(userData);
    return user;
};

export const getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user;
};

export const getUserById = async (id) => {
    const user = await User.findById(id);
    return user;
};
