import getAllTeachersPower from '../services/teacher/getAllTeachersPower';
import getTodaysAttendance from '../services/attendance/getTodaysAttendance';
import getVacantPeriods from './getVacantPeriods';
import { attendanceDatatype, schoolDatatype, teacherDatatype } from '../utils/types';
import reschedulePeriods from './reschedulePeriods';
import setReschedules from '../services/reschedule/setReschedules';
import getReschedules from '../services/reschedule/getReschedules';
import attendanceModelConstructor from '../models/attendanceDB';

export default async function reschedule(
	teacherCollection: string,
	attendanceCollection: string,
	school: schoolDatatype,
	day: number,
	preserve: boolean,
	preserveTill: number,
	prevAttendance: attendanceDatatype[],
	regenerate = false
) {
	console.log('Started the Rescheduler...');

	// Gettings all the requirements ready for rescheduling in advanced
	const savedAttendance: attendanceDatatype[] = (await getTodaysAttendance(attendanceCollection)) || [];

	// If no teacher is absent return straight away
	// and also resetting the saved attendance object
	if (savedAttendance === null || savedAttendance.length === 0) {
		const attendanceModel = attendanceModelConstructor(attendanceCollection);

		await attendanceModel.findOneAndUpdate(
			{ date: new Date().toISOString().slice(0, 10) },
			{
				date: new Date().toISOString().slice(0, 10),
				attendance:[],
				notified:[],
				preferences:[],
				day,
				preserve, 
				preserveTill,
				reschedules:[]
			}
		);
		return console.log('nothing to reschedule');
	}



	const savedTeachers: teacherDatatype[] = ((await getAllTeachersPower(teacherCollection)) as teacherDatatype[]) || [];
	const prevReschedules = await getReschedules(attendanceCollection)



	// if preserve is true
	// ********************* Preserve Reschedule Logic ****************************
	if (preserve) {
		const oldVacantPeriods = getVacantPeriods(savedTeachers, prevAttendance, school, day);

		const newVacantPeriods = getVacantPeriods(savedTeachers, savedAttendance, school, day);

		const commonVacantPeriods = oldVacantPeriods.filter(p => {
			for (const per of newVacantPeriods) {
				if (per.className === p.className && per.period === p.period) return true;
			}
			return false;
		});

		
		// adding filter for preserve till
		// if regenerate fetching preserved as saved
		const preservedReschedules = regenerate? prevReschedules.preservedReschedules || [] :(prevReschedules.reschedules || []).filter(p => {
			for (const per of commonVacantPeriods) {
				if (per.className === p.className && per.period === p.periodNo && p.periodNo <= preserveTill) return true
			}
			return false
		})

		console.log(`${preservedReschedules.length} Periods Preserved`);
		
		

		// saving preserved reschedules
		const attendanceModel = attendanceModelConstructor(attendanceCollection);
		await attendanceModel.findOneAndUpdate(
			{ date: new Date().toISOString().slice(0, 10) },
			{preservedReschedules});

		
		// getting remaining periods to reschedule
		// looping over newVacant periods and removing the once present in preserved reschedules
		const leftOverVacantPeriods = newVacantPeriods.filter(p => {
			for (const per of preservedReschedules) {
				if (per.periodNo === p.period && per.className === p.className) return false
			}
			return true
		})

		console.log(`${leftOverVacantPeriods.length} Periods to be Rescheduled`);


		
		
		// passing preserved reschedules with proper tag
		const reschedules = reschedulePeriods(leftOverVacantPeriods, savedTeachers, savedAttendance, school, day, preservedReschedules.map(r => {
			return {for: r.for, teacherId: r.teacherId, teacherName: r.teacherName, teacherPhone: r.teacherPhone, teacherEmail:r.teacherEmail, className: r.className, periodNo: r.periodNo, teacherMessagingPreference: r.teacherMessagingPreference, tags: ['preserved']}
		}))
		
		console.log('Rescheduled Periods');
		setReschedules(reschedules, attendanceCollection)
	}




	// *******************  Simple Reschedule Logic ***********************
	else {
	// getting to be rescheduled periods
	const vacantPeriods = getVacantPeriods(savedTeachers, savedAttendance, school, day);
	console.log(`${vacantPeriods.length} Periods to be Rescheduled`);
	// rescheduling the vacant periods
	const reschedules = reschedulePeriods(vacantPeriods, savedTeachers, savedAttendance, school, day);
	console.log('Rescheduled periods!');

	// setting reschedules to database
	setReschedules(reschedules, attendanceCollection);
	// uploading reschedules to JSONBIN
	// uploadReschedules(reschedules, school);
	}
}
