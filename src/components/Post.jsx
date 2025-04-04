import { useState, useEffect } from "react";
import "../styles/Post.css";

const Post = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`);
      const data = await response.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="post-container">
      <h2 className="post-title">Latest Posts</h2>
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.paragraph}</p>
            {post.image && <img src={post.image} alt={post.title} className="post-img" />}
            {post.link && <a href={post.link} target="_blank" className="post-link">Visit Link</a>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;