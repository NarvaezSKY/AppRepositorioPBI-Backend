import express from 'express';
import { getAll, getOne, create, update, remove } from './reports.controller.js';
import { authenticate, authorizeRoles } from '../../middlewares/role.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorizeRoles('admin', 'gfpi'), getAll);        // GET /api/reports?page=1&limit=10
router.get('/:id', authorizeRoles('admin', 'gfpi'), getOne);     // GET /api/reports/:id
router.post('/', authorizeRoles('admin'), create);               // POST /api/reports
router.put('/:id', authorizeRoles('admin'), update);             // PUT /api/reports/:id
router.delete('/:id', authorizeRoles('admin'), remove);          // DELETE /api/reports/:id

export default router;
