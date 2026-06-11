import app from '../src/app.js';
import { connectDB } from '../db/db.js';

let dbReady = false;

export default async function handler(req, res) {
  if (!dbReady) {
    await connectDB();
    dbReady = true;
  }

  return app(req, res);
}
