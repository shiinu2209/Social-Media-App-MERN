const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
const {
  addPost,
  editPost,
  getPost,
  getMyPost,
  deletePost,
  likePost,
  unlikePost,
  comment,
  getcomments,
  deleteComment,
} = require("../controllers/postController");
router.post("/add-post", upload.single("img"), addPost);
router.put("/edit-post/:id", upload.single("img"), editPost);
router.get("/get-posts", getPost);
router.get("/get-my-posts", getMyPost);
router.delete("/delete-post/:id", deletePost);
router.post("/like-post/:id", likePost);
router.post("/unlike-post/:id", unlikePost);
router.post("/add-comment/:id", comment);
router.get("/get-comments/:id", getcomments);
router.delete("/delete-comment/:id", deleteComment);
module.exports = router;
