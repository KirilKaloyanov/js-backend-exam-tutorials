const Course = require('../models/Course');

async function getAll(){
    const courses =  await Course.find({}).lean();
    courses.map(c => c.createdAt = c.createdAt.toLocaleString());
    return courses;
}

async function getAllByEnrolled(){
    let courses =  await Course.find({}).lean();
    courses = courses.sort((a,b) => b.enrolledUsers.length - a.enrolledUsers.length).slice(0,3);
    return courses;
}

async function createCourse(course) {
    const courses = await Course.find({});
    const existing = courses.find(c => c.title == course.title);
    if (existing) throw new Error('Course name must be unique');

    return await Course.create(course);
}

async function updateCourse(courseId, updatedCourse) {
    const courses = await Course.find({});
    const existing = courses.find(c => c.title == updatedCourse.title);
    if (existing) throw new Error('Course name must be unique');

    let course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found.');

    course.title = updatedCourse.title;
    course.description = updatedCourse.description;
    course.imageUrl = updatedCourse.imageUrl;
    course.duration = updatedCourse.duration;

    await course.save();
}

async function getCourseById(courseId) {
    return await Course.findById(courseId).lean();
}


async function enrollInCourse(courseId, userId){
    const course = await Course.findById(courseId);
    course.enrolledUsers.push(userId);

    await course.save();

}

async function deleteCourse(courseId) {
    await Course.findByIdAndRemove(courseId);
}

module.exports = {
    createCourse,
    getAll,
    getAllByEnrolled,
    getCourseById,
    enrollInCourse,
    updateCourse,
    deleteCourse
}