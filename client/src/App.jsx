import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState('');
  const [msg, setMsg] = useState('');

  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchComments = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!user || !msg) return alert("Please fill in both fields!");

    try {
      await fetch(`${BACKEND_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, content: msg }),
      });
      setUser('');
      setMsg('');
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="charblox-container">
      {/* Top Navigation Bar */}
      <header className="charblox-nav">
        <div className="nav-left">
          <div className="menu-icon">☰</div>
          <h1 className="logo">CHARBLOX</h1>
        </div>
        <div className="nav-search">
          <input type="text" placeholder="Search" />
        </div>
        <div className="nav-right">
          <span className="robux-count">⏣ 1,000,000</span>
          <div className="user-settings">⚙️</div>
        </div>
      </header>

      <main className="main-content">
        {/* Profile/Hero Section */}
        <section className="charblox-hero">
          <div className="avatar-circle">
            <img src="https://via.placeholder.com/150" alt="Avatar" />
          </div>
          <h2>Hello, <span className="username">Charles</span>!</h2>
        </section>

        {/* Friends Section (Skillset) */}
        <section className="charblox-section">
          <div className="section-header">
            <h3>Friends</h3>
            <span className="see-all">See All →</span>
          </div>
          <div className="friends-list">
            {['React', 'NestJS', 'Supabase', 'Vercel', 'UI/UX'].map((friend) => (
              <div key={friend} className="friend-item">
                <div className="friend-img"></div>
                <span>{friend}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Experiences Section (Works) */}
        <section className="charblox-section">
          <div className="section-header">
            <h3>My Experiences</h3>
            <span className="see-all">See All →</span>
          </div>
          <div className="experience-grid">
            <div className="exp-card">
              <div className="exp-banner" style={{background: 'linear-gradient(45deg, #00A2FF, #00E5FF)'}}></div>
              <div className="exp-info">
                <h4>Portfolio Tycoon</h4>
                <p>98% 👍</p>
              </div>
            </div>
            <div className="exp-card">
              <div className="exp-banner" style={{background: 'linear-gradient(45deg, #FF5722, #FF9800)'}}></div>
              <div className="exp-info">
                <h4>React Simulator</h4>
                <p>100% 👍</p>
              </div>
            </div>
          </div>
        </section>

        {/* Global Chat / Comments Section (At the Bottom) */}
        <section className="charblox-section comment-area">
          <h3>Global Chat</h3>
          <div className="chat-container">
            <div className="chat-feed">
              {comments.map((c) => (
                <div key={c.id} className="chat-msg">
                  <span className="chat-user">[{c.username}]:</span>
                  <span className="chat-text">{c.content}</span>
                </div>
              ))}
            </div>
            
            <form className="chat-input-bar" onSubmit={handlePost}>
              <input 
                type="text" 
                placeholder="Username" 
                className="user-input"
                value={user} 
                onChange={(e) => setUser(e.target.value)} 
              />
              <div className="msg-wrapper">
                <input 
                  type="text" 
                  placeholder="Say something..." 
                  value={msg} 
                  onChange={(e) => setMsg(e.target.value)}
                />
                <button type="submit">SEND</button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;