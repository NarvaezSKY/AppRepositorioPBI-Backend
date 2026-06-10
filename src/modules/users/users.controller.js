import {
  getUsers,
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
  loginUser,
} from "./users.service.js";
import jwt from "jsonwebtoken";

const getAll = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const result = await getUsers({ page, limit });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    const { password: _, ...data } = user.toObject();
    res.status(201).json(data);
  } catch (err) {
    const status = err.status || (err.code === 11000 ? 409 : 400);
    res.status(status).json({ message: err.message || "Error creating user" });
  }
};

const update = async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const user = await deleteUser(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await loginUser(req.body);
    if (!user) {
      return res.status(401).json({ message: "Credenciales invalidas" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET no esta configurado" });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    const { password: _, ...safeUser } = user.toObject();
    res.json({ user: safeUser, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export { getAll, getOne, create, update, remove, login };
