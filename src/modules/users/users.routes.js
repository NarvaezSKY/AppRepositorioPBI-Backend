import express from "express";
import {
  getAll,
  getOne,
  create,
  update,
  remove,
  login,
} from "./users.controller.js";

const router = express.Router();

router.get("/", getAll); // GET /api/users?page=1&limit=10
router.get("/:id", getOne); // GET /api/users/:id
router.post("/register", create); // POST /api/users/register
router.post("/login", login); // POST /api/users/login
router.put("/:id", update); // PUT /api/users/:id
router.delete("/:id", remove); // DELETE /api/users/:id

export default router;
