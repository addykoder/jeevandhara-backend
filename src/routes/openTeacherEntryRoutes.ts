import { Router } from 'express';
import getSchoolInfo from '../controllers/openTeacherEntry/getSchoolInfo';
import submitTeacherData from '../controllers/openTeacherEntry/submitTeacherData';

export const router = Router();


router.post('/getSchoolInfo', getSchoolInfo)
router.post('/submitTeacherData', submitTeacherData)
