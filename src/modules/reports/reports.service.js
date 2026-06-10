import { Report } from "../../models/report.js";
import { Component } from "../../models/module.js";

const isModuleVisibleToRole = (module, role) => {
  if (role === "admin") {
    return true;
  }

  return (
    Array.isArray(module?.visibleToRoles) &&
    module.visibleToRoles.includes(role)
  );
};

const getAccessibleModuleIds = async (role) => {
  if (role === "admin") {
    return null;
  }

  return Component.find({ visibleToRoles: role }).distinct("_id");
};

const getReports = async ({ page = 1, limit = 10, role } = {}) => {
  const skip = (page - 1) * limit;
  const moduleIds = await getAccessibleModuleIds(role);
  const filter = moduleIds ? { module: { $in: moduleIds } } : {};
  const [reports, total] = await Promise.all([
    Report.find(filter).populate("module").skip(skip).limit(limit).exec(),
    Report.countDocuments(filter),
  ]);

  return { reports, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const getReportById = async (id, role) => {
  const report = await Report.findById(id).populate("module").exec();

  if (!report) {
    return null;
  }

  if (!isModuleVisibleToRole(report.module, role)) {
    return null;
  }

  return report;
};

const createReport = async ({ name, description, url, module }) => {
  const moduleExists = await Component.findById(module).exec();

  if (!moduleExists) {
    const error = new Error("El modulo al que pertenece el reporte no existe");
    error.status = 404;
    throw error;
  }

  const existingReport = await Report.findOne({ name }).exec();

  if (existingReport) {
    const error = new Error("Ya existe un reporte con ese nombre");
    error.status = 409;
    throw error;
  }

  return Report.create({ name, description, url, module });
};

const updateReport = async (id, { name, description, url, module }) => {
  const fields = { name, description, url, module };
  return Report.findByIdAndUpdate(id, fields, { new: true })
    .populate("module")
    .exec();
};

const deleteReport = async (id) => {
  return Report.findByIdAndDelete(id).exec();
};

export { getReports, getReportById, createReport, updateReport, deleteReport };
