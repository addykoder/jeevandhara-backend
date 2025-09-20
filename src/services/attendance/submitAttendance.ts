import attendanceModelConstructor from '../../models/attendanceDB';
import getTodaysAttendance from './getTodaysAttendance';
import updateTodaysAttendance from './updateTodaysAttendance';
import reschedule from '../../rescheduler/rescheduler';
import { unexpectedError } from '../../utils/formatResponse';
import { attendanceDatatype, schoolDatatype } from '../../utils/types';

export default async function submitAttendance(attendance: attendanceDatatype[], attendanceCollection: string, teacherCollection: string, school: schoolDatatype, day:number, preserve: boolean, preserveTill: number) {
	try {
		// incrementing attendance version
		school.attendanceVersion = school.attendanceVersion + 1;
		school.subscription.rescheduleCount = school.subscription.rescheduleCount + 1;
		Object(school).save();
		// removing the unnecessary logic of when attendance is modified,
		// it is updated in such a way that does not shakes previous reschedules
		const attendanceModel = attendanceModelConstructor(attendanceCollection);
		// if (await attendance.findOne({date: new Date().toISOString().slice(0,10)}).exec() !== null) return 'Attendance already taken today'

		const prevAttendance = await getTodaysAttendance(attendanceCollection);

		const preferences = {
					excludedClasses: school.preferences.excludedClasses,
					excludedTeachers: school.preferences.excludedTeachers,
					excludedPeriods: school.preferences.excludedPeriods,
					restrictToCategory: school.preferences.restrictToCategory,
					restrictToLevel: school.preferences.restrictToLevel,
					allotRelatedTeacher: school.preferences.allotRelatedTeacher,
					chunkPriorityHalves: school.preferences.chunkPriorityHalves
				}

		// If attendance is been taken again
		if (prevAttendance != null) {
			return await updateTodaysAttendance(attendance, day, preferences, attendanceCollection, preserve, preserveTill).then(async () => {
				await reschedule(teacherCollection, attendanceCollection, school, day, preserve, preserveTill, prevAttendance);
				return 'attendance updated successfully';
			});
		}

		// If the attendance is been taken for the first time
		else {
			const currentAttendance = new attendanceModel({
				date: new Date().toISOString().slice(0, 10),
				attendance,
				day,
				preferences, 
				preserve,
				preserveTill
			});

			return await currentAttendance
				.save()
				.then(() => {
					reschedule(teacherCollection, attendanceCollection, school, day, preserve, preserveTill, []);
					return 'attendance submitted successfully';
				})
				.catch(err => {
					console.log(err);
					return err;
				});
		}
	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}
