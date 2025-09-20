import { Router } from 'express';
import getReschedules from '../controllers/reschedules/getReschedules';
import notifyTeachers from '../controllers/reschedules/notifyTeachers';
import regenerateReschedules from '../controllers/reschedules/regenerateReschedules';
import getTeacherSummary from '../controllers/reschedules/getSubstitutionSummary';
import modifyReschedules from '../controllers/reschedules/modifyReschedules';

export const router = Router();


router.get('/', getReschedules);
router.post('/summary', getTeacherSummary);

router.post('/confirmNotify', notifyTeachers)
router.post('/regenerate', regenerateReschedules)
router.post('/modify', modifyReschedules)