import { Router } from 'express';
import createTeacher from '../controllers/teacher/createTeacher';
import getTeacher from '../controllers/teacher/getTeacher';
import getAllTeachers from '../controllers/teacher/getAllTeachers';
import deleteTeacher from '../controllers/teacher/deleteTeacher';
import updateTeacher from '../controllers/teacher/updateTeacher';

export const router = Router();

// endpoint for creating teacher
router.post('/', createTeacher);

// endpoint for getting all teacher's info [name, id, classTeacher of]
router.get('/', getAllTeachers);

// endpoint for getting a single teacher's detailed info
router.get('/:teacherID', getTeacher);

//endpoint for deleting a teacher database
router.delete('/:teacherID', deleteTeacher);

// endpoint for updating a teacher database
router.post('/:teacherID', updateTeacher);
