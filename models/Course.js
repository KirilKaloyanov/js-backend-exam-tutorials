const {Schema, model, Types} = require('mongoose');

const URL_PATTERN= /^https?:\/\/.+$/i;


const courseSchema = new Schema({

    title: {type: String, required: true, minlength: [4, 'Course name must be minimum 4 characters long.']},
    description: {type: String, required: true, minlength: [20, 'Course description must be minimum 20 characters long'], maxlength: [50, 'Course description must be up to 50 characters']},
    imageUrl: {type: String, required: true, validate: {
        validator: (value) => URL_PATTERN.test(value),
        message: 'Image URL is not valid'
    }},
    duration: {type: String, required: true},
    createdAt: {type: Date, required: true},
    owner: { type: Types.ObjectId, ref: 'User', required: true },
    enrolledUsers: {type: [Types.ObjectId], ref:'User'}
});



const Course = model('Course', courseSchema);

module.exports = Course;