import mongoose, { type Model, type Document, type ObjectId } from 'mongoose'
import isEmail from 'validator/lib/isEmail'
import bcrypt from 'bcryptjs'

interface UserDocumentInterface extends Document {
  name: string
  email: string
  password: string
}

interface UserModelInterface extends Model<UserDocumentInterface> {
  login: (email: string, password: string) => UserDocumentInterface
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
    validate: [isEmail, 'Email is not valid.']
  },
  password: {
    type: String,
    required: [true, 'Password field is empty.'],
    minlength: [8, 'Password min lenght is 8.']
  }
})

// Mongoose Hooks.
// Function to be triggered right before the doc is saved on the DB.
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// statics?
UserSchema.statics.login = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email })
  if (user !== null) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    }
    throw Error('Incorrect Password')
  } else {
    throw Error('Email not registered')
  }
}

// Function to be triggered right after the doc is saved.
UserSchema.post('save', function (doc, next) {
  console.log('After user creation')
  next()
})

export const UserModel = mongoose.model<UserDocumentInterface, UserModelInterface>('User', UserSchema)

export const createUser: any = async (userData: Record<string, any>) => await new UserModel(userData)
  .save()
  .then((user) => {
    return user.toObject()
  })
export const getUsers: any = async () => await UserModel.find()
export const getUserByEmail: any = async (email: string) => await UserModel.findOne({ email })
export const getUserById: any = async (id: ObjectId) => await UserModel.findOne({ _id: id })
export const updateUserById: any = (id: string, userData: Record<string, any>) => UserModel.findByIdAndUpdate(id, userData)
export const deleteUserById: any = (id: string) => UserModel.findOneAndDelete({ _id: id })
