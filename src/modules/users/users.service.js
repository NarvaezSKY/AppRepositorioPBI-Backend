import bcrypt from 'bcryptjs';
import { User } from '../../models/user.js';

const SALT_ROUNDS = 10;

const getUsers = async ({ page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find({}, { password: 0 }).skip(skip).limit(limit).exec(),
    User.countDocuments(),
  ]);
  return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const getUserById = async (id) => {
  return User.findById(id, { password: 0 }).exec();
};

const registerUser = async ({ username, email, password, role }) => {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  return User.create({ username, email, password: hashed, role });
};

const updateUser = async (id, { username, email, password, role }) => {
  const fields = { username, email, role };
  if (password) fields.password = await bcrypt.hash(password, SALT_ROUNDS);
  return User.findByIdAndUpdate(id, fields, { new: true, projection: { password: 0 } }).exec();
};

const deleteUser = async (id) => {
  return User.findByIdAndDelete(id).exec();
};

export { getUsers, getUserById, registerUser, updateUser, deleteUser };
