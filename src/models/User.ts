import mongoose, { type Model, type Document, type ObjectId } from 'mongoose'
import isEmail from 'validator/lib/isEmail'
import bcrypt from 'bcryptjs'

interface UserDocumentInterface extends Document {
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

interface UserModelInterface extends Model<UserDocumentInterface> {
  login: (email: string, password: string) => UserDocumentInterface
}

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the User was created
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the User was updated
 *   example:
 *     id: d5fE_asz
 *     name: John Snow
 *     email: john.snow@gmail.com
 *     createdAt: 2020-03-10T04:05:06:157Z
 *     updatedAt: 2020-03-10T04:05:06.157Z
 */
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name field is empty']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    unique: true,
    validate: [isEmail, 'Invalid email format']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  }
},
{
  timestamps: true
})

/* 
  Mongoose Hooks.
  Function to be triggered before the doc is saved on the DB. 
*/
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

/* 
  Statics are pretty much the same as methods but allow for defining functions that 
  exists directly on your model 
*/
UserSchema.statics.login = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email })
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    }
    throw new Error('Incorrect username or password')
  } else {
    throw new Error('Incorrect username or password')
  }
}

export const UserModel = mongoose.model<UserDocumentInterface, UserModelInterface>('User', UserSchema)

export const getUsers: any = async () => await UserModel.find()
export const getUserByEmail: any = async (email: string) => await UserModel.findOne({ email })
export const getUserById: any = async (id: ObjectId) => await UserModel.findOne({ _id: id })
export const updateUserById: any = (id: string, userData: Record<string, any>) => UserModel.findByIdAndUpdate(id, userData)
export const deleteUserById: any = (id: string) => UserModel.findOneAndDelete({ _id: id })
