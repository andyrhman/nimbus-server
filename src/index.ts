import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { routes } from './routes';
import { ValidationMiddleware } from './middleware/validation.middleware';
import { errorMiddleware } from './middleware/global-error.middleware';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(ValidationMiddleware);
app.use(errorMiddleware);
app.use(cors({
    credentials: true,
    origin: ['*']
}));

routes(app);

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});