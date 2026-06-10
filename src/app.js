import express from 'express';
import cors from 'cors';
import usersRouter from './modules/users/users.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Modules
app.use('/api/users', usersRouter);

export default app;
