import { rateLimit } from 'express-rate-limit'

// not global coz of multiple admins for multiple schools in future
export const adminLimiter = rateLimit({
	max: 200,
	windowMs: 1000*60*10, // 10 minutes
	message: 'Too many requests, wait for 10 minutes before trying again'
})


export const attendanceHistoryLimiter = rateLimit({
	max: 5,
	windowMs: 1000*60*60, // 1 hour 
	message: 'Too many requests, wait for 60 minutes before reloading'
})

// global limiter
export const signUpLimiter = rateLimit({
	max: 10,
	windowMs: 1000*60*60*24, // 1 day 
	// this function should return a unique identifier for a user taking req and res as argument (req, res) => identifier, by default set to request IP address,
	// if return a static string, this limiter will become a global one
	keyGenerator: ()=>'global',
	message: 'Too many SignUp requests, try Signing Up Tomorrow'
})

export const takeAttendanceLimiter = rateLimit({
	max: 20,
	windowMs: 1000*60*10, // 10 minutes;
	message: 'Too many Submit attendance requests, wait for 20 minutes to make another'
})

export const publicApiLimiter = rateLimit({
	max: 500,
	windowMs: 1000*60*10, // 10 minutes
	message: 'Too many requests, wait for 10 minutes before reloading'
})

export const loginLimiter = rateLimit({
	max: 20,
	windowMs: 1000*60*5, // 5 minutes
	message: 'Too many login attempts, wait for 10 minute and try again'
})

export const verifyLoginLimiter = rateLimit({
	max: 20,
	windowMs: 1000*60*1, // 1 minutes
	message: 'Too many requests, wait for 1 minute before reloading'
})