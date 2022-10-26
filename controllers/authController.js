const authController = require("express").Router();

const { register, login } = require("../services/userService");
const { parseError } = require("../util/parser");

authController.get("/register", (req, res) => {
  //TODO: replace with actual view by assignment
  res.render("register", {
    title: "Register page",
  });
});

authController.post("/register", async (req, res) => {
  const CREDENTIALS_PATTERN = /^[a-zA-Z0-9]+$/i;
  try {
    if (req.body.username.length < 5 || !CREDENTIALS_PATTERN.test(req.body.username)) {
      throw new Error("Username must be at least 5 characters long and should include only english letters and digits.");
    }
    if (req.body.password.length < 5 || !CREDENTIALS_PATTERN.test(req.body.password)) {
      throw new Error("Password must be at least 5 characters long and should include only english letters and digits.");
    }
    if (req.body.password != req.body.repass) {
      throw new Error("Passwords don't match.");
    }

    const token = await register(req.body.username, req.body.password);

    //TODO: check assignment if register creates session
    res.cookie("token", token);
    res.redirect("/"); //TODO: replace with redirect by assignment
  } catch (error) {
    const errors = parseError(error);

    //TODO: add error display from actual template from assignment
    res.render("register", {
      title: "Register page",
      errors,
      body: {
        username: req.body.username,
      },
    });
  }
});

authController.get("/login", (req, res) => {
  //TODO: replace with actual view by assignment
  res.render("login", {
    title: "Login Page",
  });
});

authController.post("/login", async (req, res) => {
  try {
    const token = await login(req.body.username, req.body.password);

    res.cookie("token", token);
    res.redirect("/"); //TODO: replace with redirect by assignment
  } catch (error) {
    const errors = parseError(error);

    //TODO: add error display from actual template from assignment

    res.render("login", {
      title: "Login Page",
      errors,
      body: {
        username: req.body.username,
      },
    });
  }
});

authController.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = authController;
