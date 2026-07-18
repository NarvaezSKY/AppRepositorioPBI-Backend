import { Report } from "../../models/report.js";
import { Component } from "../../models/module.js";

const syncModuleReportCount = async (moduleId) => {
  if (!moduleId) {
    return;
  }

  const reportCount = await Report.countDocuments({ module: moduleId });
  await Component.findByIdAndUpdate(moduleId, { reportCount }).exec();
};

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

const createReport = async ({ name, description, url, module, directnavigate }) => {
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

  const report = await Report.create({ name, description, url, module, directnavigate });
  await syncModuleReportCount(module);

  return report;
};

const updateReport = async (id, { name, description, url, module, directnavigate }) => {
  const existingReport = await Report.findById(id).exec();

  if (!existingReport) {
    return null;
  }

  if (module && String(existingReport.module) !== String(module)) {
    const moduleExists = await Component.findById(module).exec();

    if (!moduleExists) {
      const error = new Error("El modulo al que pertenece el reporte no existe");
      error.status = 404;
      throw error;
    }
  }

  const fields = { name, description, url, module, directnavigate };
  const updatedReport = await Report.findByIdAndUpdate(id, fields, { new: true })
    .populate("module")
    .exec();

  if (!updatedReport) {
    return null;
  }

  await syncModuleReportCount(existingReport.module);
  await syncModuleReportCount(updatedReport.module?._id || updatedReport.module);

  return updatedReport;
};

const deleteReport = async (id) => {
  const deletedReport = await Report.findByIdAndDelete(id).exec();

  if (!deletedReport) {
    return null;
  }

  await syncModuleReportCount(deletedReport.module);

  return deletedReport;
};

export { getReports, getReportById, createReport, updateReport, deleteReport };
