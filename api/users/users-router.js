const express = require("express");
const {
  validateUserId,
  validateUser,
  validatePost,
} = require("../middleware/middleware");
// You will need `users-model.js` and `posts-model.js` both
const userModel = require("./users-model");
const postModel = require("../posts/posts-model");
// The middleware functions also need to be required

const router = express.Router();

router.get("/", (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  userModel.get().then((users) => {
    if (!users) {
      res.status(404).json({ message: "does not exist" });
    } else {
      res.json(users);
    }
  });
});

router.get("/:id", validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user);
});

router.post("/", validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  userModel
    .insert({ name: req.name })
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch(next);
});

router.put("/:id", validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  userModel
    .update(req.params.id, { name: req.name })
    .then((user) => {
      res.json(user);
    })
    .catch(next);
});

router.delete("/:id", validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user);
  userModel
    .remove(req.params.id)
    .then((deletedUser) => {
      res.json(deletedUser);
    })
    .catch(next);
});

router.get("/:id/posts", validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  userModel
    .getUserPosts(req.params.id)
    .then((posts) => {
      res.json(posts);
    })
    .catch(next);
});

router.post("/:id/posts", validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  postModel
    .insert({ user_id: req.params.id, text: req.text })
    .then((post) => {
      res.json(post);
    })
    .catch(next);
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    customMessage: "something tragic inside posts router happened",
    message: err.message,
    stack: err.stack,
  });
});

// do not forget to export the router
module.exports = router;
