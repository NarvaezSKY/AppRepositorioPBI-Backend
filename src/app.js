import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import usersRouter from './modules/users/users.routes.js';
import modulesRouter from './modules/modules/modules.routes.js';
import reportsRouter from './modules/reports/reports.routes.js';
import { setupSwagger } from './config/swagger.js';
import {
  FRONTEND_DEV_URL,
  FRONTEND_STG_URL,
  FRONTEND_PROD_URL,
} from '../config/dbCredentials.js';

const app = express();

const allowedOrigins = [
  FRONTEND_DEV_URL,
  FRONTEND_STG_URL,
  FRONTEND_PROD_URL,
].filter(Boolean);

const strictOriginBlocker = (req, res, next) => {
  const requestOrigin = req.headers.origin;

  // Si no hay Origin, suele ser una llamada servidor-servidor o herramientas locales.
  if (!requestOrigin) return next();

  if (!allowedOrigins.includes(requestOrigin)) {
    return res.status(403).json({
      message: 'Origin not allowed',
    });
  }

  return next();
};

const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(strictOriginBlocker);
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
setupSwagger(app);

// Routes
app.use('/api/users', usersRouter);
app.use('/api/modules', modulesRouter);
app.use('/api/reports', reportsRouter);

app.use((err, req, res, next) => {
  if (err?.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'Origin not allowed' });
  }

  const status = Number.isInteger(err?.status) ? err.status : 500;
  const safeMessage = status >= 500 ? 'Internal server error' : err?.message;
  return res.status(status).json({ message: safeMessage || 'Unexpected error' });
});

export default app;
