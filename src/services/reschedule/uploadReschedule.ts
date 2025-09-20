import axios from 'axios';
import { unexpectedError } from '../../utils/formatResponse';
import { schoolDatatype } from '../../utils/types';

// This service is no longer in use
export default async function uploadReschedules(reschedules: object[], school: schoolDatatype) {
	try {
		axios.defaults.headers.common['X-Master-Key'] = process.env.MASTER_KEY_JSONBIN;
		const binId = school.binId;
		const config = { headers: { 'Content-Type': 'Application/json', 'X-Bin-Private': false } };

		const info = {
			date: new Date().toISOString().slice(0, 10),
			reschedules,
		};
		// if binId is not present: create a new bin and save it's id
		if (!binId) {
			const resp = await axios.post('https://api.jsonbin.io/v3/b/', info, config).catch(e => console.log(e.message));
			console.log('new bin created\nReschedules uploaded');
			school.binId = resp?.data.metadata.id;
			Object(school).save();
		}
		// else upload to the previous bin
		else {
			axios.put(`https://api.jsonbin.io/v3/b/${binId}`, info)
				.then(() => console.log('Reschedules uploaded!'))
				.catch(e => console.log(e.message));
		}
	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}
