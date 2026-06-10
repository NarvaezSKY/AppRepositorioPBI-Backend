import { Component } from '../../models/module.js';

const VALID_ROLES = ['admin', 'gfpi'];

const sanitizeRoles = (roles = []) => {
  return [...new Set(roles.filter((role) => VALID_ROLES.includes(role)))];
};

const buildVisibleRoles = ({ visibleToRoles }) => {
  if (Array.isArray(visibleToRoles)) {
    return sanitizeRoles(visibleToRoles);
  }

  return undefined;
};

const buildModuleFilter = (role) => {
  if (role === 'admin') {
    return {};
  }

  return { visibleToRoles: role };
};

const getModules = async ({ page = 1, limit = 10, role } = {}) => {
  const skip = (page - 1) * limit;
  const filter = buildModuleFilter(role);
  const [modules, total] = await Promise.all([
    Component.find(filter).skip(skip).limit(limit).exec(),
    Component.countDocuments(filter),
  ]);

  return { modules, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const getModuleById = async (id, role) => {
  return Component.findOne({ _id: id, ...buildModuleFilter(role) }).exec();
};

const createModule = async ({ name, description, visibleToRoles }) => {
  const resolvedVisibleRoles = buildVisibleRoles({ visibleToRoles });
  return Component.create({
    name,
    description,
    visibleToRoles: resolvedVisibleRoles ?? [],
  });
};

const updateModule = async (id, { name, description, visibleToRoles }) => {
  const fields = { name, description };
  const resolvedVisibleRoles = buildVisibleRoles({ visibleToRoles });

  if (resolvedVisibleRoles !== undefined) {
    fields.visibleToRoles = resolvedVisibleRoles;
  }

  return Component.findByIdAndUpdate(id, fields, { new: true }).exec();
};

const deleteModule = async (id) => {
  return Component.findByIdAndDelete(id).exec();
};

export { getModules, getModuleById, createModule, updateModule, deleteModule };
