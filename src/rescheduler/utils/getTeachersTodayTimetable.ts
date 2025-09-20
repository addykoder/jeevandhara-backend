import { teacherDatatype } from '../../utils/types';
import ntd from './dayNumberToName';

export default function getTeachersTodayTimetable(teacher: teacherDatatype, day:number): string[] {
	// here trying to get teacher's timetable of today's day
	// if it's sunday it will be undefined and hence [] will be returned
	// the whole is then spread to a new array to protect against changes
	// made in future
	return [...(teacher.timeTable[ntd(day)] || [])];
}
