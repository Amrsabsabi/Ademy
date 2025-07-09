import express from 'express';
import { updateCourse,getAllCourse,getCourseId } from '../controllers/courseController.js';
import { protectEducator } from '../middlewares/authMiddleware.js';

const courseRouter = express.Router();
courseRouter.get('/all', getAllCourse);
courseRouter.get('/:id', getCourseId);
courseRouter.put('/:id', protectEducator, updateCourse);

export default courseRouter;



