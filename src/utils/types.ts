import { Request } from 'express';

export type teacherCategory = 'subjunior' | 'junior' | 'senior' | 'pgt';

export type classType = string;
export type period = classType | 'free' | 'busy';

export interface teacherTimetable extends stringKey {
	mon: period[];
	tue: period[];
	wed: period[];
	thu: period[];
	fri: period[];
	sat: period[];
}

interface stringKey {
	[key: string]: period[];
}

export interface teacherDatatype extends verifyTeacherDatatype {
	id: number;
	classesTeaching: string[];
}
export interface verifyTeacherDatatype {
	name: string;
	category: teacherCategory;
	timeTable: teacherTimetable;
	classTeacherOf: classType;
	maxTeachingClass: string;
	phone?: number;
	email?: string;
	messagingPreference: 'whatsapp' | 'email' | 'sms' | 'none';
	password?: string;
}
export interface attendanceDatatype {
	id: number;
	presentPeriods: number[];
}

export interface notifiedDatatype {
	id: number;
	name: string;
	way: string;
	notified: boolean;
}
export interface school extends schoolDatatype {
	username: string;
}
export interface customRequest extends Request {
	school?: schoolDatatype;
	teachers?: string;
	attendance?: string;
	username?: string;
	isAdmin?: boolean;
}

export interface reschedulesDatatype {
	for: string;
	teacherId: number | undefined;
	teacherName: string | undefined;
	teacherPhone?: number | undefined;
	teacherEmail?: string | undefined;
	teacherMessagingPreference: string | undefined;
	className: string;
	periodNo: number;
	reason?: string;
	tags?: string[];
}

export interface attPrefDatatype {
	excludedClasses: string[];
	excludedTeachers: number[];
	excludedPeriods: number[];
	restrictToCategory: boolean;
	restrictToLevel: boolean;
	allotRelatedTeacher: boolean;
	chunkPriorityHalves: 'no'|'strict'|'moderate';
}

export interface freeTeachersDatatype {
	id: number;
	name: string;
	phone?: number;
	email?: string;
	messagingPreference: string;
	category: teacherCategory;
	todayTimetable: string[];
	priority: number;
	classesTeaching: string[];
	handlingLevel: number;
}

export interface schoolDatatype {
	username: string;
	binId?: string;
	schoolName: string;
	adminName: string;
	phone: number;
	email: string;
	adminPassword: string;
	password: string;
	subscription: {
		expiresOn: object[];
		maxTeachers: number;
		smsSent: number;
		whatsappSent: number;
		emailSent: number;
		rescheduleCount: number;
	};
	payments: {
		date: object;
		amount: number;
		success: boolean;
		order: object;
		checkout?: object;
	}[];
	teacherCollection: string;
	attendanceCollection: string;
	nextRollNumber: number;
	messagingSubscribed: string[];
	attendanceVersion: number;
	messagedVersion: number;
	preferences: {
		excludedClasses: string[];
		excludedTeachers: number[];
		excludedPeriods: number[];
		restrictToCategory: boolean;
		restrictToLevel: boolean;
		allotRelatedTeacher: boolean;
		teacherModificationAllowed: boolean;
		weekdayPeriod: number;
		saturdayPeriod: number;
		enableMessaging: boolean;
		chunkPriorityHalves: 'no'|'strict'|'moderate';
	};
	classes: {
		name: string;
		handlingLevel: number;
		category: 'subjunior' | 'junior' | 'senior' | 'pgt';
	}[];
	apiAccess: {
		requestsCount: number;
	};
}

export interface preferenceOverwriteType {
	excludedClasses?: string[];
	excludedTeachers?: number[];
	excludedPeriods?: number[];
	restrictToCategory?: boolean;
	restrictToLevel?: boolean;
	allotRelatedTeacher?: boolean;
	teacherModificationAllowed?: boolean;
	weekdayPeriod?: number;
	saturdayPeriod?: number;
	enableMessaging?: boolean;
	chunkPriorityHalves?: 'no'|'strict'|'moderate';
}

export type classesOverwriteType = classesType[];

export interface classesType {
	name: string;
	category: teacherCategory;
	handlingLevel: number;
}

export interface requestedRescheduleType {
	for: string;
	classCategory: teacherCategory;
	classLevel: number;
	className: string;
	period: number;
}
