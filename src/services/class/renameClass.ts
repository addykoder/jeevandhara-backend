import { classesOverwriteType } from '../../utils/types';
import schoolModel from '../../models/schoolDB';
import { msg } from '../../utils/formatResponse';
import { unexpectedError } from '../../utils/formatResponse';
import teacherModelConstructor from '../../models/teacherDB';

export default async function updateClasses(username: string, teacherCollection: string, prevName:string, newName:string, allClasses: classesOverwriteType) {
	try {
		
		const newClasses = allClasses.map(c => {
				if (c.name === prevName) return {handlingLevel:c.handlingLevel, category: c.category, name:newName}
				return c
		})
		
		// updating classname from classes list
		const message = await schoolModel.findOneAndUpdate({ username }, {classes: newClasses}).then(() => msg('Class Renamed successfully'));
		
		// updating the className in teacher timetables
		const teacher = teacherModelConstructor(teacherCollection);
		for await (const doc of teacher.find()) {
			doc.classTeacherOf = doc.classTeacherOf === prevName ? newName : doc.classTeacherOf;

			// looping through timetable for update
				
					
				doc.timeTable.mon = doc.timeTable.mon.map(c => {
					if (c === prevName) return newName
					return c
				})
				doc.timeTable.tue = doc.timeTable.tue.map(c => {
					if (c === prevName) return newName
					return c
				})
				doc.timeTable.wed = doc.timeTable.wed.map(c => {
					if (c === prevName) return newName
					return c
				})
				doc.timeTable.thu = doc.timeTable.thu.map(c => {
					if (c === prevName) return newName
					return c
				})
				doc.timeTable.fri = doc.timeTable.fri.map(c => {
					if (c === prevName) return newName
					return c
				})
				doc.timeTable.sat = doc.timeTable.sat.map(c => {
					if (c === prevName) return newName
					return c
				})

			await doc.save();
		}
		return message;
	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}
