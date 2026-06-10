import express from 'express';
import { getAll, getOne, create, update, remove } from './modules.controller.js';
import { authenticate, authorizeRoles } from '../../middlewares/role.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorizeRoles('admin', 'gfpi'), getAll);        // GET /api/modules?page=1&limit=10
router.get('/:id', authorizeRoles('admin', 'gfpi'), getOne);     // GET /api/modules/:id
router.post('/create', authorizeRoles('admin'), create);               // POST /api/modules/create
router.put('/:id', authorizeRoles('admin'), update);             // PUT /api/modules/:id
router.delete('/:id', authorizeRoles('admin'), remove);          // DELETE /api/modules/:id

export default router;
