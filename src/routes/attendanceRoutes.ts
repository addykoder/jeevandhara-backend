import { Router } from 'express';
import submitAttendance from '../controllers/attendance/submitAttendance';
import getTodaysAttendance from '../controllers/attendance/getTodaysAttendance';
import getSpecificDateAttendanceHandler from '../controllers/attendance/getSpecificDateAttendance';
import getLastMonthAttendance from '../controllers/attendance/getLastMonthAttendance';
import { attendanceHistoryLimiter } from '../middlewares/rateLimiter';

export const router = Router();

router.post('/', submitAttendance);
router.get('/', getTodaysAttendance);

// specific to dashboard items
router.get('/date/:date', getSpecificDateAttendanceHandler)
// attendance history limiter to limit no of history request
router.get('/history',attendanceHistoryLimiter, getLastMonthAttendance)
