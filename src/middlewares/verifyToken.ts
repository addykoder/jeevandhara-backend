import { Response, NextFunction } from 'express';
import { customRequest } from '../utils/types';
import { verify } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import schoolModel from '../models/schoolDB';
import { err, unexpectedError } from '../utils/formatResponse';
dotenv.config();

export default async function verifyToken(req: customRequest, res: Response, next: NextFunction) {
	try {
		const token = req.body.token || req.query.token || req.headers['token'];
		if (!token) {
			res.status(200).json(err('access token not found'));
			return;
		}
		const decoded = Object(verify(token, process.env.TOKEN_KEY as string));
		const school = await schoolModel.findOne({ username: decoded.username });

		if (!school) return res.status(200).json(err('invalid token'));
		if (school.password !== decoded.password || school.adminPassword !== decoded.adminPassword) return res.status(200).json(err('Token verification updated'));

		req.school = school;
		req.teachers = school?.teacherCollection;
		req.attendance = school?.attendanceCollection;
		req.username = school?.username;
		req.isAdmin = decoded.isAdmin;

		next();
		// incrementing the request count using fineOneAndUpdate to avoid parallel save error
		schoolModel.findOneAndUpdate({ username: decoded.username }, { $inc: { 'apiAccess.requestsCount': 1 } }, () => {
			null;
		});
		// increment the database calls count
		// school.apiAccess.requestsCount = school.apiAccess.requestsCount + 1;
		// school.save()
	} catch (e) {
		// if token is expired
		if (Object(e).name === 'TokenExpiredError') return res.status(200).json(err('token expired'));
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
