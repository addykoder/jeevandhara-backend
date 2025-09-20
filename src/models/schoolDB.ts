import mongoose from 'mongoose';

// This mongodb collection is to store data about schools
// and their preferences
const schoolSchema = new mongoose.Schema({
	username: { type: String, required: true, index: true, unique: true },
	schoolName: { type: String, required: true },
	adminName: { type: String, required: true },
	phone: { type: Number, required: true },
	email: { type: String, required: true },
	adminPassword: { type: String, required: true },
	password: { type: String, required: true },
	teacherCollection: { type: String, required: true },
	attendanceCollection: { type: String, required: true },
	nextRollNumber: { type: Number, default: 1 },
	binId: String,
	messagingSubscribed: { type: [String], required: true, default: [] },
	attendanceVersion: { type: Number, default: 0 },
	messagedVersion: { type: Number, default: 0 },

	classes: [
		{
			name: { type: String, required: true },
			handlingLevel: { type: Number, max: 50, min: -10, required: true },
			category: { type: String, enum: ['subjunior', 'junior', 'senior', 'pgt'], required: true },
		},
	],

	subscription: {
		type: {
			expiresOn: { type: [Date], required: true },
			maxTeachers: { type: Number, required: true, default: 0 },
			smsSent: { type: Number, required: true, default: 0 },
			whatsappSent: { type: Number, required: true, default: 0 },
			emailSent: { type: Number, required: true, default: 0 },
			rescheduleCount: { type: Number, required: true, default: 0 },
		},
		required: true,
	},

	payments: {
		type: [
			{
				date: { type: Date, required: true },
				amount: { type: Number, required: true },
				success: { type: Boolean, required: true, default: false },
				order: { type: Object, required: true },
				checkout: { type: Object },
			},
		],
		default: [],
	},

	preferences: {
		type: {
			excludedClasses: { type: [String], default: [] },
			excludedTeachers: { type: [Number], default: [] },
			excludedPeriods: { type: [Number], default: [] },
			restrictToCategory: { type: Boolean, default: false },
			restrictToLevel: { type: Boolean, default: false },
			allotRelatedTeacher: { type: Boolean, default: true },
			teacherModificationAllowed: { type: Boolean, default: false },
			weekdayPeriod: { type: Number, default: 8 },
			saturdayPeriod: { type: Number, default: 6 },
			enableMessaging: { type: Boolean, default: false },
			chunkPriorityHalves: { type: String, enum:['strict','no','moderate'], default: 'no' },
		},
		required: true,
	},

	apiAccess: {
		type: {
			requestsCount: { type: Number, default: 0 },
		},
		required: true,
	},
});

const schoolModel = mongoose.model('schools', schoolSchema);
schoolModel.syncIndexes();

export default schoolModel;
