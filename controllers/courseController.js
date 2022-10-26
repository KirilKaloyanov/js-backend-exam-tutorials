const courseController = require('express').Router();
const { createCourse, getCourseById, enrollInCourse, updateCourse, deleteCourse } = require('../services/courseService');
const { parseError } = require('../util/parser');

courseController.get('/create', (req, res) => {
    res.render('createCourse', {
        title: 'Create Course',
        user: req.user,

    });
});

courseController.post('/create', async (req, res) => {
    const course = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        duration: req.body.duration,
        createdAt: Date.now(),
        owner: req.user._id
    };

    try {
        if (Object.values(course).some(v => !v)) {
            throw new Error('All fields are required.')
        }

        await createCourse(course);
        res.redirect('/');

    } catch (err) {
        res.render('createCourse', {
            title: 'Create Course',
            user: req.user,
            body: course,
            errors: parseError(err)
        });
    }
});

courseController.get('/details/:id', async (req, res) => {
    const courseId = req.params.id;
    // console.log('username', res.locals.username);
    // console.log('req.user', req.user);

    const course = await getCourseById(courseId);

    if (course.owner == req.user._id) course.isOwner = true;
    if (course.enrolledUsers.map(u => u.toString()).indexOf(req.user._id) >= 0) course.isEnrolled = true;;

    res.render('courseDetails', {
        title: "Course Details",
        course
    });
});

courseController.get('/enroll/:id', async (req, res) => {
    const courseId = req.params.id;

    await enrollInCourse(courseId, req.user._id);
    res.redirect(`/course/details/${courseId}`)
});

courseController.get('/edit/:id', async (req, res) => {
    const courseId = req.params.id;
    const course = await getCourseById(courseId);

    res.render('editCourse', {
        title: 'Edit Course',
        course
    });
});

courseController.post('/edit/:id', async (req, res) => {
    const courseId = req.params.id;
    const course = await getCourseById(courseId);
    const updatedCourse = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        duration: req.body.duration
    }

    try {
        if (Object.values(updatedCourse).some(v => !v)) {
            throw new Error('All fields are required.')
        }

        await updateCourse(courseId, updatedCourse);
        res.redirect(`/course/details/${courseId}`);

    } catch (err) {
        res.render('createCourse', {
            title: 'Create Course',
            user: req.user,
            body: course,
            errors: parseError(err)
        });
    }
});

courseController.get('/delete/:id', async (req, res) => {
    await deleteCourse(req.params.id);
    res.redirect('/');
});

module.exports = courseController;