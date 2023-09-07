import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, required: true, select: false },
        sessionToken: { type: String, select: false }
    }
});

export const UserModel = mongoose.model('User', UserSchema)

export const getUsers = () => UserModel.find()
export const getUserByName = (name) => UserModel.find((user) => user.name === name)