import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
	date: { type: Date, required: true, unique: true, index: true },
	// for saving which of the teachers are notified
	notified: [
		{
			id: { type: Number, required: true },
			name: { type: String, required: true },
			way: { type: String, required: true },
			notified: { type: Boolean, required: true },
		},
	],
	attendance: {
		type: [
			{
				id: { type: Number, required: true },
				presentPeriods: { type: [Number], required: true },
			},
		],
		required: true,
	},
	reschedules: [
		{
			teacherId: { type: Number, required: true },
			teacherName: { type: String, required: true },
			teacherMessagingPreference: { type: String, required: true },
			className: { type: String, required: true },
			periodNo: { type: Number, required: true },
			for: { type: String, required: true },
			teacherPhone: Number,
			teacherEmail: String,
			reason: String,
			tags: [String]
		},
	],
	day: {
		type: Number,
		enum: [0,1,2,3,4,5,6],
		required: true
	},

	preferences: {
		type: {
			excludedClasses: { type: [String], required:true},
			excludedTeachers: { type: [Number], required:true },
			excludedPeriods: { type: [Number], required:true},
			restrictToCategory: { type: Boolean, required:true },
			restrictToLevel: { type: Boolean, required:true},
			allotRelatedTeacher: { type: Boolean, required:true },
			chunkPriorityHalves: { type: String, enum:[ 'strict', 'moderate', 'no' ], required:true },
		},
		required: true,
	}, 

	preserve: {required: true, type: Boolean},
	preserveTill: { required: true, type: Number }, 
	preservedReschedules:[
		{
			teacherId: { type: Number, required: true },
			teacherName: { type: String, required: true },
			teacherMessagingPreference: { type: String, required: true },
			className: { type: String, required: true },
			periodNo: { type: Number, required: true },
			for: { type: String, required: true },
			teacherPhone: Number,
			teacherEmail: String,
			reason: String,
		},
	]

});

export default function attendanceModelConstructor(name: string) {
	const attendance = mongoose.model(name, attendanceSchema);
	attendance.syncIndexes();
	return attendance;
}
