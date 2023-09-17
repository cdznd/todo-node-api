import mongoose, { Model, Document } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcryptjs';

interface UserDocumentInterface extends Document {
    name: String,
    email: String,
    password: string,
}

interface UserModelInterface extends Model<UserDocumentInterface> {
    login(email: String, password: string): UserDocumentInterface; 
}

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

// statics?
UserSchema.statics.login = async (email: String, password: string) => {
    const user = await UserModel.findOne({ email });
    if(user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user;
        }
        throw Error('Incorrect Password');
    }else{
        throw Error('Email not registered');
    }
}

// Function to be triggered right after the doc is saved.
UserSchema.post('save', function(doc, next){
    console.log('After user creation');
    next();
})

export const UserModel = mongoose.model<UserDocumentInterface, UserModelInterface>('User', UserSchema)

export const createUser = (userData: Record<string, any>) => new UserModel(userData)
    .save()
    .then((user) => {
        return user.toObject();
    })
export const getUsers = () => UserModel.find()
export const getUserByEmail = async (email: string) => await UserModel.findOne({ email: email })
export const updateUserById = (id: string, userData: Record<string, any>) => UserModel.findByIdAndUpdate(id, userData);
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id })