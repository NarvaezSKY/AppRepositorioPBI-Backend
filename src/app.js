import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import usersRouter from './modules/users/users.routes.js';
import modulesRouter from './modules/modules/modules.routes.js';
import reportsRouter from './modules/reports/reports.routes.js';
import { setupSwagger } from './config/swagger.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
setupSwagger(app);

// Routes
app.use('/api/users', usersRouter);
app.use('/api/modules', modulesRouter);
app.use('/api/reports', reportsRouter);

export default app;
