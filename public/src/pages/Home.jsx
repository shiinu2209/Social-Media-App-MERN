import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Post from "../components/Post";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddEdit from "../components/AddEdit";

const Home = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [postfilter, setPostFilter] = useState("all");
  const handleLogout = () => {
    error && setError("");
    localStorage.removeItem("token");
    navigate("/login");
  };
  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("post/get-posts");
      if (response.status === 200) {
        setPosts(response.data.posts);
        console.log(response.data);
      } else {
        setError("Error fetching posts");
      }
    } catch (error) {
      setError(error.response.data.error);
    }
  };
  const showAllPosts = async () => {
    setPostFilter("all");
    fetchPosts();
  };
  const showMyPosts = async () => {
    setPostFilter("my");
    try {
      const response = await axiosInstance.get("post/get-my-posts");
      if (response.status === 200) {
        setPosts(response.data.posts);
        console.log(response.data);
      } else {
        setError("Error fetching posts");
      }
    } catch (error) {
      setError(error.response.data.error);
    }
  };
  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.delete(`post/delete-post/${id}`);
      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "bottom-right",
          autoClose: 2000,
          height: 40,
          width: 200,
        });

        await showMyPosts();
        setPostFilter(postfilter);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      setError(error.response.data.error);
    }
  };
  const handleSubmit = (e, title, content) => {
    e.preventDefault();
    if (state === "add") {
      handleAdd(title, content);
    } else {
      handleEdit(title, content);
    }

    console.log("Form submitted");
  };
  const handleAdd = async (title, content) => {
    const formData = new FormData();

    formData.append("img", title);
    formData.append("content", content);
    console.log(title);
    try {
      console.log(formData.get("img"));
      await axiosInstance.post("post/add-post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Post added successfully");
      setState("");
      if (postfilter === "all") {
        fetchPosts();
      } else {
        showMyPosts();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = async (title, content) => {
    try {
      const formData = new FormData();
      formData.append("img", title);
      formData.append("content", content);
      const id = localStorage.getItem("id");
      await axiosInstance.put(`post/edit-post/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Post edited successfully");
      setState("");
      if (postfilter === "all") {
        fetchPosts();
      } else {
        showMyPosts();
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (postfilter === "all") {
      fetchPosts();
    }
    if (postfilter === "my") {
      showMyPosts();
    }
  }, []);
  return (
    <div className="bg-gray-600 min-h-screen relative">
      <ToastContainer />
      <nav className="bg-gray-800 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="ml-10 flex items-baseline space-x-4">
                <button
                  onClick={showAllPosts}
                  className={
                    postfilter === "all"
                      ? "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  }
                >
                  ALL-Posts
                </button>

                <button
                  onClick={showMyPosts}
                  className={
                    postfilter === "my"
                      ? "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  }
                >
                  MY-Posts
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            LogOut
          </button>
        </div>
      </nav>
      <div className="fixed bottom-0 w-full">
        {state === "add" || state === "edit" ? (
          <AddEdit
            state={state}
            handleSubmit={handleSubmit}
            setState={setState}
          ></AddEdit>
        ) : (
          <button
            onClick={() => setState("add")}
            className="bg-blue-600 hover:bg-blue-700  fixed bottom-4 right-5 text-white font-bold py-2 px-4 rounded border
          "
          >
            Add Post
          </button>
        )}
      </div>
      <div className="flex flex-col items-center  ">
        {posts.map((post) => (
          <Post
            key={post._id}
            postfilter={postfilter}
            imgURL={post.imageUrl}
            content={post.content}
            id={post._id}
            likes={post.likes}
            postedBy={post.createdBy.username}
            handleDelete={handleDelete}
            setState={setState}
            fetchPosts={fetchPosts}
            showMyPosts={showMyPosts}
          ></Post>
        ))}
      </div>
      <div className="fixed bottom-0 w-full">
        {state === "add" || state === "edit" ? (
          <AddEdit
            state={state}
            handleSubmit={handleSubmit}
            setState={setState}
          ></AddEdit>
        ) : (
          <button
            onClick={() => setState("add")}
            className="bg-blue-600 hover:bg-blue-700  fixed bottom-4 right-5 text-white font-bold py-2 px-4 rounded border
          "
          >
            Add Post
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
