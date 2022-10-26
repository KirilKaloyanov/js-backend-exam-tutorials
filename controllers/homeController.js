const homeController = require("express").Router();
const {getAll, getAllByEnrolled} = require('../services/courseService');

//TODO replace with real controller by assignment

homeController.get("/", async (req, res) => {
  let courses;
  if (req.user) courses = await getAll();
   else courses = await getAllByEnrolled();
  res.render("home", {
    title: "Home page",
    // user: req.user,
    courses
  });
});

homeController.post('/search', async (req, res) => {
  let courses = await getAll();
  let searchStr = req.body.searchString;
  searchStr = searchStr.toLowerCase();
  courses = courses.filter(c => c.title.toLowerCase().includes(searchStr));
  res.render("home", {
    title: "Home page",
    courses
  });
});

module.exports = homeController;
