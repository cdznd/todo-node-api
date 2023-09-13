import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name field is empty.']
    },
    email: {
        type: String,
        required: [true, 'Email field is empty.'],
        lowercase: true,
        unique: true,
        validate: [ isEmail, 'Email is not valid.']
    },
    password: {
        type: String,
        required: [true, 'Password field is empty.'],
        minlength: [8, 'Password min lenght is 8.']
    }
});

// Mongoose Hooks.
// Function to be triggered right before the doc is saved on the DB.
UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// Function to be triggered right after the doc is saved.
UserSchema.post('save', function(doc, next){
    console.log('After user creation');
    next();
})

export const UserModel = mongoose.model('User', UserSchema)

export const createUser = (userData: Record<string, any>) => new UserModel(userData)
    .save()
    .then((user) => {
        return user.toObject();
    })
export const getUsers = () => UserModel.find()
export const getUserByEmail = async (email: string) => await UserModel.findOne({ email: email })
export const updateUserById = (id: string, userData: Record<string, any>) => UserModel.findByIdAndUpdate(id, userData);
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id })