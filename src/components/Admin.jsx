import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

const Admin = () => {
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [image, setImage] = useState(null);
  const [link, setLink] = useState("");
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("isAdmin")) navigate("/login");
    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Fetch posts error:", error);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("paragraph", paragraph);
    if (image) formData.append("image", image);
    formData.append("link", link);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 sec timeout

      const response = await fetch(
        editingPostId
          ? `${import.meta.env.VITE_API_BASE_URL}/posts/${editingPostId}`
          : `${import.meta.env.VITE_API_BASE_URL}/posts`,
        {
          method: editingPostId ? "PUT" : "POST",
          body: formData,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      const responseData = await response.json();
      console.log("Post Response:", response.status, responseData);

      if (response.ok) {
        fetchPosts();
        setTitle("");
        setParagraph("");
        setImage(null);
        setLink("");
        setEditingPostId(null);
        alert(editingPostId ? "Post updated successfully!" : "Post created successfully!");
      } else {
        console.error("Post failed:", response.status, responseData);
        alert(`Failed to ${editingPostId ? "update" : "post"}: ${responseData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Error: " + (error.name === "AbortError" ? "Request timed out" : error.message));
    }
  };

  const handleDelete = async (id) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 50000);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${id}`, {
        method: "DELETE",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const responseData = await response.json();
      console.log("Delete Response:", response.status, responseData);

      if (response.ok) {
        fetchPosts();
      } else {
        console.error("Delete failed:", response.status, responseData);
        alert(`Failed to delete: ${response.status} - ${responseData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error: " + (error.name === "AbortError" ? "Request timed out" : error.message));
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setParagraph(post.paragraph);
    setLink(post.link);
    setImage(null);
    setEditingPostId(post.id);
    handleDelete(post.id);
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Dashboard</h2>
      <form onSubmit={handlePost} className="admin-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="admin-input"
        />
        <textarea
          placeholder="Paragraph"
          value={paragraph}
          onChange={(e) => setParagraph(e.target.value)}
          className="admin-textarea"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="admin-file"
        />
        <input
          type="url"
          placeholder="Add Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="admin-input"
        />
        <button type="submit" className="admin-button">
          {editingPostId ? "Update Post" : "Post"}
        </button>
      </form>

      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.paragraph}</p>
            {post.image && <img src={post.image} alt={post.title} className="post-img" />}
            {post.link && <a href={post.link} target="_blank" className="post-link">Visit Link</a>}
            <div className="post-actions">
              <button onClick={() => handleEdit(post)} className="edit-btn">Edit</button>
              <button onClick={() => handleDelete(post.id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;