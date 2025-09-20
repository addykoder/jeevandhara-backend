import { Router } from 'express';
import updatePreferences from '../controllers/preference/updatePreference';
import getPreferences from '../controllers/preference/getPreference';

export const router = Router();

router.post('/update', updatePreferences);
router.get('/', getPreferences)