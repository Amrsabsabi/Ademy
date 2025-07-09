import Course from "../models/Course.js";

//Get all courses
export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).select
      (['-courseContent', '-enrolledStudents']).populate({ path: 'educator' })

    res.json({ success: true, courses })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

//Get course by ID
export const getCourseId = async (req, res) => {
  const { id } = req.params

  try {
    const courseData = await Course.findById(id).populate({ path: 'educator' })

    courseData.courseContent.forEach(chapter => {
      chapter.chapterContent.forEach(lecture => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      })
    })
    res.json({ success: true, courseData })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    if (updateFields.courseContent && Array.isArray(updateFields.courseContent)) {
      for (const chapter of updateFields.courseContent) {
        for (const lecture of chapter.chapterContent || []) {
          if (!lecture.isPreviewFree && (!lecture.lectureUrl || lecture.lectureUrl.trim() === "")) {
            return res.status(400).json({
              success: false,
              message: `Missing lectureUrl for "${lecture.lectureTitle}" in chapter "${chapter.chapterTitle}"`
            });
          }
        }
      }
    }
    const allowedUpdates = {
      coursePrice: updateFields.coursePrice,
      discount: updateFields.discount,
      courseContent: updateFields.courseContent,
    };

    Object.keys(allowedUpdates).forEach(key => {
      if (allowedUpdates[key] === undefined) {
        delete allowedUpdates[key];
      }
    });

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      allowedUpdates,
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, data: updatedCourse });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
