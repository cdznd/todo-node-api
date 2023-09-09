import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

export const UserModel = mongoose.model('User', UserSchema)

export const createUser = (userData: Record<string, any>) => new UserModel(userData)
    .save()
    .then((user) => {
        return user.toObject();
    })
export const getUsers = () => UserModel.find()
export const getUserByEmail = (email: string) => UserModel.findOne({ email: email })
export const updateUserById = (id: string, userData: Record<string, any>) => UserModel.findByIdAndUpdate(id, userData);
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id })