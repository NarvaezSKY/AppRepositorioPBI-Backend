import dotenv from "dotenv"
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI;

export const FRONTEND_DEV_URL = process.env.FRONTEND_DEV_URL;
export const FRONTEND_STG_URL = process.env.FRONTEND_STG_URL;
export const FRONTEND_PROD_URL = process.env.FRONTEND_PROD_URL;