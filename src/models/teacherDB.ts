import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
	id: { type: Number, required: true, unique: true, index: true },
	name: { type: String, required: true },
	category: { type: String, enum: ['subjunior', 'junior', 'senior', 'pgt'], required: true },
	classTeacherOf: { type: String, required: true },
	maxTeachingClass: { type: String, required: true },
	classesTeaching: { type: [String], required: true },
	phone: Number,
	email: String,
	messagingPreference: { type: String, enum: ['whatsapp', 'email', 'sms', 'none'], default: 'none', required: true },
	password: { type: String, required: true },

	timeTable: {
		type: {
			mon: [String],
			tue: [String],
			wed: [String],
			thu: [String],
			fri: [String],
			sat: [String],
		},
		required: true,
	},
});

export default function teacherModelConstructor(name: string) {
	const teacher = mongoose.model(name, teacherSchema);
	teacher.syncIndexes();
	return teacher;
}
