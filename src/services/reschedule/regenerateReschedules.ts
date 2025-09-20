import attendanceModelConstructor from '../../models/attendanceDB';
import reschedule from '../../rescheduler/rescheduler';
import { msg, unexpectedError } from '../../utils/formatResponse';
import { schoolDatatype } from '../../utils/types';

export default async function regenerateReschedules(attendanceCollection: string, teacherCollection:string, school:schoolDatatype) {
	try {
		const attendance = attendanceModelConstructor(attendanceCollection);
		const attendanceObject = await attendance.findOne({ date: new Date().toISOString().slice(0, 10) }, '-_id').exec();
		if (!attendanceObject) return msg('Previous attendance not found, cannot regenerate');
		const day: number = attendanceObject.day;
		const preserve: boolean = attendanceObject.preserve;
		const preserveTill: number = attendanceObject.preserveTill

		// updating database information
		school.attendanceVersion = school.attendanceVersion + 1;
		school.subscription.rescheduleCount = school.subscription.rescheduleCount + 1;
		Object(school).save();

		// here giving regenerate = true so passing prevAttendance is not necessary
		reschedule(teacherCollection, attendanceCollection, school, day, preserve, preserveTill, [], true)
		return msg('Rescheduling Started');
	} catch (e) {
		console.log(e);
		return { ...unexpectedError, reschedules: null };
	}
}
