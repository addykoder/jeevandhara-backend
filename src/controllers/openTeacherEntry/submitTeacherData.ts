import { Request, Response } from 'express';
import { err, unexpectedError } from '../../utils/formatResponse';
import submitTeacherData from '../../services/openTeacherEntry/submitTeacherData';
import schoolModel from '../../models/schoolDB';

export default async function submitTeacherDataHandler(req: Request, res: Response) {
	try {
		// getting the school username and then fetching school data of that school
		if (!req.body.username) return res.status(200).json(err('school username required'));
		if (req.body.username === 'test') return res.status(200).json(err('Action not allowed in test account'));
		const { name, timeTable, classTeacherOf } = req.body;
		const username = req.body.username;
		const phone = req.body.phone;
		const email = req.body.email;
		const messagingPreference = req.body.messagingPreference;
		const maxTeachingClass = req.body.maxTeachingClass || '.';
		const password = req.body.password;
		if (!password) return res.status(200).json(err('password required'));

		if (!(messagingPreference && maxTeachingClass && name && timeTable && classTeacherOf)) return res.status(200).json(err('incomplete info'));

		// creating teacher category with classes
		const classesTeaching: string[] = classTeacherOf === 'free' ? [] : [classTeacherOf];
		for (const day of Object.values(timeTable)) {
			for (const period of day as string) {
				if (!['free', 'busy'].includes(period)) classesTeaching.push(period);
			}
		}
		const school = await schoolModel.findOne({ username: username });
		if (!school) return res.status(200).json(err('invalid school'));
		const classes = school.classes;
		let jr = 0;
		let sr = 0;
		let sbjr = 0;
		let pgt = 0;

		classesTeaching.map(cls => {
			for (const cl of classes) {
				if (cl.name === cls) {
					switch (cl.category) {
						case 'junior':
							jr += 1;
							break;
						case 'senior':
							sr += 1;
							break;
						case 'subjunior':
							sbjr += 1;
							break;
						case 'pgt':
							pgt += 1;
					}
				}
			}
		});

		let vr = 0;
		let category: 'subjunior' | 'junior' | 'senior' | 'pgt' = 'subjunior';
		if (jr >= sbjr) {
			vr = jr;
			category = 'junior';
		}
		if (sr >= vr) {
			vr = sr;
			category = 'senior';
		}
		if (pgt >= vr) {
			vr = pgt;
			category = 'pgt';
		}

		const response = await submitTeacherData(username, { name, timeTable, classTeacherOf, maxTeachingClass, phone, email, messagingPreference, password, category });

		res.status(200).json(response);
	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}
