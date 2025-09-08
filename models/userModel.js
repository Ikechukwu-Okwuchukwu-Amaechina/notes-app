const { mongoose } = require('./db');


const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otpCode: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function findByEmail(email) {
  return User.findOne({ email: new RegExp(`^${email}$`, 'i') }).exec();
}

async function createUser({ name, email, phone, passwordHash, otpCode, otpExpiresAt }) {
  const user = await User.create({ name, email, phone, passwordHash, otpCode, otpExpiresAt });
  return user;
}

async function updateUser(user) {
  const id = user.id || user._id;
  if (!id) return null;
  const update = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    passwordHash: user.passwordHash,
    isVerified: user.isVerified,
    otpCode: user.otpCode,
    otpExpiresAt: user.otpExpiresAt,
  };
  // remove undefined fields to avoid overwriting
  Object.keys(update).forEach(k => update[k] === undefined && delete update[k]);
  return User.findByIdAndUpdate(id, update, { new: true }).exec();
}

async function findById(id) {
  return User.findById(id).exec();
}

module.exports = { User, findByEmail, createUser, updateUser, findById };
