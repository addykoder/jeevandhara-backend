import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
// Importing routes
import { router as teacherRoutes } from './routes/teacherRoutes';
import { router as attendanceRoutes } from './routes/attendanceRoutes';
import { router as rescheduleRoutes } from './routes/rescheduleRoutes';
import { router as authenticationRoutes } from './routes/authRoutes';
import { router as classRoutes } from './routes/classRoutes';
import { router as preferenceRoutes } from './routes/preferenceRoutes';
import { router as openTeacherEntryRoutes } from './routes/openTeacherEntryRoutes';
import { router as subscriptionRoutes } from './routes/subscriptionRoutes';
import { adminLimiter, publicApiLimiter } from './middlewares/rateLimiter';

// Importing middlewares
import verifyToken from './middlewares/verifyToken';
import bodyParser from 'body-parser';
import cors from 'cors';
import verifySubscription from './middlewares/verifySubscription';
import getPublicReschedulesHandler from './controllers/reschedules/getPublicReschedules';
import changePassword from './controllers/auth/changePassword';
import preflightHandler from './middlewares/preflightHandler';

// loading environment variables
dotenv.config();

// settings strict query coz of warning in console
mongoose.set('strictQuery', true);
// Connecting the app to mongodb database
mongoose
	.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/substitutor')
	.then(() => console.log('Connected to the Database...'))
	.catch(e => {
		console.log(e, '\nError Connecting to database');
	});

// creating the app
const app = express();

// initializing required variables
const port = Number(process.env.PORT || 80);

// always 200 route for health check
app.get('/ping', (req, res) => res.send('ok'));

// adding middlewares
app.use(bodyParser.json());


const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://jeevandhara.vercel.app" // production frontend
];

// settings up cors
app.use(cors({ origin: "*" }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser requests like Postman
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies/auth headers
}))
// setting up preflight handler to avoid cors errors
app.use(preflightHandler)

// routes not needing token verification
app.use('/auth', authenticationRoutes);
// limiting public routes
app.use('/entry', publicApiLimiter, openTeacherEntryRoutes);
app.get('/reschedule/:username', publicApiLimiter, getPublicReschedulesHandler);

// routes needing token verification
app.use(adminLimiter);
app.use(verifyToken);
app.post('/changePassword', changePassword);
app.use('/subscription', subscriptionRoutes);

// using admin limiter
app.use('/teacher', teacherRoutes);
app.use('/classes', classRoutes);
app.use('/preference', preferenceRoutes);
app.use('/reschedule', rescheduleRoutes);

// routes needing subscription verification
app.use(verifySubscription);
app.use('/attendance', attendanceRoutes);

//starting the application
app.listen(port, () => {
	console.log(`Listening at ${port} ...`);
});

export default app;
