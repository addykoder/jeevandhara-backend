import { classesOverwriteType } from '../../utils/types';
import schoolModel from '../../models/schoolDB';
import { msg } from '../../utils/formatResponse';
import { unexpectedError } from '../../utils/formatResponse';
import teacherModelConstructor from '../../models/teacherDB';

export default async function updateClasses(classes: classesOverwriteType, username: string, teacherCollection: string) {
	try {
		const clsnms = classes.map(c => c.name);
		clsnms.push('free')
		clsnms.push('busy')
		const message = await schoolModel.findOneAndUpdate({ username }, { classes }).then(() => msg('classes updated successfully'));
		const teacher = teacherModelConstructor(teacherCollection);

		for await (const doc of teacher.find()) {
			doc.classTeacherOf = clsnms.includes(doc.classTeacherOf) ? doc.classTeacherOf : 'free';

			// looping through timetable for update
				
				
				doc.timeTable.mon = doc.timeTable.mon.map(c => {
					if (clsnms.includes(c)) return c
					return 'free'
				})
				doc.timeTable.tue = doc.timeTable.tue.map(c => {
					if (clsnms.includes(c)) return c
					return 'free'
				})
				doc.timeTable.wed = doc.timeTable.wed.map(c => {
					if (clsnms.includes(c)) return c
					return 'free'
				})
				doc.timeTable.thu = doc.timeTable.thu.map(c => {
					if (clsnms.includes(c)) return c
					return 'free'
				})
				doc.timeTable.fri = doc.timeTable.fri.map(c => {
					if (clsnms.includes(c)) return c
					return 'free'
				})
				doc.timeTable.sat = doc.timeTable.sat.map(c => {
					if (clsnms.includes(c)) return c
					return 'free'
				})

			await doc.save();
		}
		return message;
	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}
