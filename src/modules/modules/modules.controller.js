import {
  getModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
} from './modules.service.js';

const getAll = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const result = await getModules({ page, limit, role: req.user.role });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const module = await getModuleById(req.params.id, req.user.role);
    if (!module) return res.status(404).json({ message: 'Module not found' });
    res.json(module);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const module = await createModule(req.body);
    res.status(201).json(module);
  } catch (err) {
    const status = err.code === 11000 ? 409 : 400;
    res.status(status).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const module = await updateModule(req.params.id, req.body);
    if (!module) return res.status(404).json({ message: 'Module not found' });
    res.json(module);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const module = await deleteModule(req.params.id);
    if (!module) return res.status(404).json({ message: 'Module not found' });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export { getAll, getOne, create, update, remove };
