import React, { useState, useEffect } from "react";

import axiosInstance from "../utils/axiosInstance";
import { AiOutlineLike, AiFillLike, AiOutlineComment } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
const Post = ({
  imgURL,
  content,
  postfilter,
  id,
  likes,
  postedBy,
  handleDelete,
  setState,
  fetchPosts,
  showMyPosts,
}) => {
  const [totalLikes, setLikes] = useState(likes.length);
  const [liked, setLiked] = useState(false);
  const [commentopen, setCommentopen] = useState(false);
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(false);

  const hanndleLike = async () => {
    try {
      const response = await axiosInstance.post(`post/like-post/${id}`);
      if (response.status === 200) {
        setLikes(totalLikes + 1);
        if (postfilter === "all") {
          fetchPosts();
        } else {
          showMyPosts();
        }
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleUnlike = async () => {
    console.log("unlike");
    try {
      const response = await axiosInstance.post(`post/unlike-post/${id}`);
      if (response.status === 200) {
        setLikes(totalLikes - 1);
        if (postfilter === "all") {
          fetchPosts();
        } else {
          showMyPosts();
        }
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCommentDelete = async (e, commentId) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.delete(
        `post/delete-comment/${id}/${commentId}`
      );
      if (response.status === 200) {
        console.log("comment deleted");
        getComments();
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentopen(false);
    const content = e.target[0].value;
    e.target[0].value = "";
    try {
      const response = await axiosInstance.post(`post/add-comment/${id}`, {
        content,
      });
      if (response.status === 200) {
        console.log("comment added");
        setCommentopen(false);
        if (postfilter === "all") {
          fetchPosts();
        } else {
          showMyPosts();
        }

        getComments();
        setCommentopen(true);
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getComments = async () => {
    try {
      const response = await axiosInstance.get(`post/get-comments/${id}`);
      if (response.status === 200) {
        setComments(response.data.comments);
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const userId = localStorage.getItem("user");
    console.log(userId);
    setLiked(likes.includes(userId));
  }, [likes]);
  useEffect(() => {
    getComments();
  }, []);
  return (
    <div className="bg-gray-800 text-white p-4  rounded-lg shadow-lg m-5 relative min-w-[600px]">
      {postedBy && (
        <div className="text-sm text-gray-400">
          Posted by:
          <span className="text-white"> {postedBy.toUpperCase()}</span>
        </div>
      )}
      {postfilter === "my" && (
        <div
          onClick={() => setOpen(!open)}
          className=" absolute top-2 right-2 hover:cursor-pointer  text-white font-bold py-2 px-4 rounded"
        >
          ...
          <div>
            {open && (
              <div className="absolute top-8 z-10 right-2 bg-gray-700 p-2 rounded-lg shadow-lg">
                <button
                  onClick={() => {
                    setState("edit");
                    localStorage.setItem("id", id);
                  }}
                  className="text-white p-2 text-lg"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    handleDelete(e, id);
                  }}
                  className="text-white p-2 text-lg"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="my-2 flex justify-center">
        <img
          className=" w-[400px] h-[400px] object-cover rounded-lg shadow-lg"
          src={`http://localhost:3000/${imgURL}`}
          alt=""
        />
      </div>
      <p className="text-lg font-mono">{content.toUpperCase()}</p>
      <div className="flex justify-between mt-4">
        <div className="flex justify-start items-center">
          <div
            className=" hover:bg-blue-600 text-white font-bold  mr-2  rounded border
                    "
          >
            {liked ? (
              <button className="py-1 px-2" onClick={handleUnlike}>
                <AiFillLike className="text-2xl"></AiFillLike>
              </button>
            ) : (
              <button className="py-1 px-2" onClick={hanndleLike}>
                <AiOutlineLike className="text-2xl"></AiOutlineLike>
              </button>
            )}
          </div>
          <span>liked by {likes.length} user</span>
        </div>
        <div className="flex justify-end items-center relative">
          <button
            onClick={() => {
              setCommentopen(!commentopen);
            }}
            className="border hover:bg-blue-600 text-white font-bold py-1 px-2 rounded"
          >
            <AiOutlineComment className="text-2xl"></AiOutlineComment>
          </button>
          <div>
            {commentopen && (
              <div className="absolute bottom-5  right-5  bg-gray-700 p-2 rounded-lg shadow-lg border border-black">
                <form onSubmit={handleCommentSubmit}>
                  <input
                    type="text"
                    className="bg-gray-700 border-white border-[1px] rounded  p-2 mb-4"
                  ></input>
                  <div className="max-h-[90px] w-full overflow-scroll border-b border-t p-2">
                    {comments.length === 0 ? (
                      <div className="text-white">no comment yet</div>
                    ) : (
                      comments.map((comment) => (
                        <div
                          className="border rounded m-2 p-1 relative"
                          key={comment._id}
                        >
                          <span className="text-white font-bold ">
                            {comment.content.toUpperCase()}
                          </span>

                          <div className="text-sm text-gray-400">
                            commented by:
                            <span className="text-white">
                              {comment.createdBy.username.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <button
                    type="submit"
                    className="text-white mt-1 px-1 border border-white hover:bg-blue-600 rounded  text-lg"
                  >
                    Submit
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
