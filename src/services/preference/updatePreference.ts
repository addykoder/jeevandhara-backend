import { preferenceOverwriteType } from '../../utils/types';
import schoolModel from '../../models/schoolDB';
import { msg } from '../../utils/formatResponse';
import { unexpectedError } from '../../utils/formatResponse';

import teacherModelConstructor from '../../models/teacherDB';

export default async function updatePreference(preference: preferenceOverwriteType, username: string, teacherCollection: string, wp: number, sp: number) {
	const teacher = teacherModelConstructor(teacherCollection);

	if (username === 'test') {
		preference.weekdayPeriod = 8;
		preference.saturdayPeriod = 6;
	}

	if (await teacher.count()) {
		preference.weekdayPeriod = wp;
		preference.saturdayPeriod = sp;
	}
	try {
		// updating each property of preferences separately for flexibity of the api interface

		if (preference.excludedTeachers !== undefined) {
			await schoolModel.findOneAndUpdate({ username }, { $set: { 'preferences.excludedTeachers': preference.excludedTeachers } }).exec();
		}
		if (preference.excludedClasses !== undefined) {
			await schoolModel.findOneAndUpdate({ username }, { $set: { 'preferences.excludedClasses': preference.excludedClasses } }).exec();
		}
		if (preference.excludedPeriods !== undefined) {
			await schoolModel.findOneAndUpdate({ username }, { $set: { 'preferences.excludedPeriods': preference.excludedPeriods } }).exec();
		}
		if (preference.restrictToCategory !== undefined) {
			await schoolModel.findOneAndUpdate({ username }, { $set: { 'preferences.restrictToCategory': preference.restrictToCategory } }).exec();
		}
		if (preference.restrictToLevel !== undefined) {
			await schoolModel.findOneAndUpdate({ username }, { $set: { 'preferences.restrictToLevel': preference.restrictToLevel } }).exec();
		}
		if (preference.allotRelatedTeacher !== undefined) {
			await schoolModel.findOneAndUpdate({ username }, { $set: { 'preferences.allotRelatedTeacher': preference.allotRelatedTeacher } }).exec();
		}
		if (preference.teacherModificationAllowed !== undefined) {
			await schoolModel.findOneAndUpdate({ username }, { $set: { 'preferences.teacherModificationAllowed': preference.teacherModificationAllowed } }).exec();
		}
		if (preference.weekdayPeriod !== undefined) {
			await schoolModel.findOneAndUpdate({ username }, { $set: { 'preferences.weekdayPeriod': preference.weekdayPeriod } }).exec();
		}
		if (preference.saturdayPeriod !== undefined) {
			await schoolModel.findOneAndUpdate({ username }, { $set: { 'preferences.saturdayPeriod': preference.saturdayPeriod } }).exec();
		}
		if (preference.enableMessaging !== undefined) {
			await schoolModel.findOneAndUpdate({ username }, { $set: { 'preferences.enableMessaging': preference.enableMessaging } }).exec();
		}

		if (preference.chunkPriorityHalves !== undefined) {
			await schoolModel.findOneAndUpdate({ username }, { $set: { 'preferences.chunkPriorityHalves': preference.chunkPriorityHalves } }).exec();
		}

		return msg('successfully updated preferences');
	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}
