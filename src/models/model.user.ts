import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  isPerformer: {
    type: Boolean,
    require: true,
  },
});

export const User = mongoose.model('User', UserSchema);
