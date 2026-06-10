import {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
} from './reports.service.js';

const getAll = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const result = await getReports({ page, limit, role: req.user.role });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const report = await getReportById(req.params.id, req.user.role);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const report = await createReport(req.body);
    res.status(201).json(report);
  } catch (err) {
    const status = err.status || (err.code === 11000 ? 409 : 400);
    res.status(status).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const report = await updateReport(req.params.id, req.body);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const report = await deleteReport(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export { getAll, getOne, create, update, remove };
