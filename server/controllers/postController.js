const jwt = require("jsonwebtoken");
const Post = require("../models/Post");
const addPost = async (req, res) => {
  try {
    const { content } = req.body;
    const imageUrl = req.file.path;
    const token = req.header("Authorization").split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (!verify) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const post = new Post({
      imageUrl,
      content,
      createdBy: verify.user._id,
    });
    await post.save();
    res.status(200).json({ message: "Post added successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const editPost = async (req, res) => {
  try {
    const { content } = req.body;
    const imageUrl = req.file.path;
    if (!imageUrl) {
      return res.status(400).json({ error: "Image is required" });
    }
    const token = req.header("Authorization").split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (!verify) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const postExists = await Post.findById(req.params.id);
    if (!postExists) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (postExists.createdBy.toString() !== verify.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const newimageUrl = imageUrl || postExists.imageUrl;
    const Content = content || postExists.content;

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        imageUrl: newimageUrl,
        content: Content,
      },
      { new: true }
    );

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getPost = async (req, res) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (!verify) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const posts = await Post.find().populate("createdBy", "username");
    const sortedPosts = posts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getMyPost = async (req, res) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (!verify) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const posts = await Post.find({ createdBy: verify.user._id });
    const sortedPosts = posts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deletePost = async (req, res) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (!verify) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const postExists = await Post.findById(req.params.id);
    if (!postExists) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (postExists.createdBy.toString() !== verify.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const likePost = async (req, res) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (!verify) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const postExists = await Post.findById(req.params.id);
    if (!postExists) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (postExists.likes.includes(verify.user._id)) {
      return res.status(400).json({ error: "Post already liked" });
    }
    postExists.likes.push(verify.user._id);
    await postExists.save();
    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const unlikePost = async (req, res) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (!verify) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const postExists = await Post.findById(req.params.id);
    if (!postExists) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (!postExists.likes.includes(verify.user._id)) {
      return res.status(400).json({ error: "Post not liked" });
    }
    const index = postExists.likes.indexOf(verify.user._id);
    postExists.likes.splice(index, 1);
    await postExists.save();
    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const comment = async (req, res) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (!verify) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const postExists = await Post.findById(req.params.id);
    if (!postExists) {
      return res.status(404).json({ error: "Post not found" });
    }
    postExists.comments.push({
      content: req.body.content,
      createdBy: verify.user._id,
    });
    await postExists.save();

    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getcomments = async (req, res) => {
  try {
    const postExists = await Post.findById(req.params.id).populate(
      "comments.createdBy",
      "username"
    );
    if (!postExists) {
      return res.status(404).json({ error: "Post not found" });
    }
    const sortedComments = postExists.comments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    console.log(sortedComments);
    res.status(200).json({
      comments: sortedComments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteComment = async (req, res) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    const verify = await jwt.verify(token, process.env.JWT_SECRET);
    if (!verify) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
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
};
