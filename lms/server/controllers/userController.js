import Course from "../models/Course.js";
import User from "../models/User.js";
import { CourseProgress } from "../models/CourseProgress.js";
import { Purchase } from "../models/Purchase.js";
//get user data
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//user enrolled courses with lecture links
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const userData = await User.findById(userId).populate("enrolledCourses");

    res.json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// enroll user to course 
export const enrollCourse = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    if (!course || !user) {
      return res.status(404).json({ success: false, message: "Course or User not found" });
    }

    if (course.enrolledStudents && course.enrolledStudents.includes(userId)) {
      return res.json({ success: true, message: "Already enrolled" });
    }

    // Add user to course
    course.enrolledStudents = course.enrolledStudents || [];
    course.enrolledStudents.push(userId);
    await course.save();

    // Add course to user
    user.enrolledCourses = user.enrolledCourses || [];
    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }


let purchase = await Purchase.findOne({ userId, courseId });

if (purchase) {
  purchase.status = "completed";
  await purchase.save();
} else {
  await Purchase.create({
    userId,
    courseId,
    amount: course.coursePrice * (1 - course.discount / 100),
    status: 'completed'
  });
}


    res.json({ success: true, message: "Enrollment successful and purchase updated." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//Update User Course progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, lectureId } = req.body;
    const progressData = await CourseProgress.findOne({ userId, courseId });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({ success: true, message: "Lecture Already Completed" });
      }
      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }
    res.json({ success: true, message: "Progress Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Get user course progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId } = req.body;
    const progressData = await CourseProgress.findOne({ userId, courseId });

    res.json({ success: true, progressData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//add user rating to course
export const addUserRating = async (req, res) => {
  const userId = req.auth.userId;
  const { courseId, rating } = req.body;

  if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
    return res.json({ success: false, message: "Invalid Details." });
  }
  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.json({ success: false, message: "Course Not Found." });
    }
    const user = await User.findById(userId);

    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({ success: false, message: "User has not purchased this course." });
    }

    const existingRatingIndex = course.courseRatings.findIndex((r) => r.userId === userId);
    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }
    await course.save();

    return res.json({ success: true, message: "Rating added." });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
