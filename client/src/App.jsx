import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. Setup State for the comments and the form
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState('');
  const [msg, setMsg] = useState('');

  // 2. Function to fetch comments from your NestJS backend
  const fetchComments = async () => {
    try {
      // Note: When you host on Vercel, change 'localhost:3000' to your backend URL
      const res = await fetch('http://localhost:3000/comments');
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // 3. Load comments automatically when the page opens
  useEffect(() => {
    fetchComments();
  }, []);

  // 4. Function to send a new comment to the database
  const handlePost = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    if (!user || !msg) return alert("Please fill in both fields!");

    try {
      await fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, content: msg }),
      });

      // Clear the form and refresh the list
      setUser('');
      setMsg('');
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="portfolio-container">
      {/* Hero Section */}
      <section className="section">
        <div style={{ border: '4px solid #333', borderRadius: '50%', width: '150px', height: '150px', margin: '0 auto 20px', overflow: 'hidden' }}>
          <img src="https://via.placeholder.com/150" alt="Profile" />
        </div>
        <h1>HELLO, I'M <span className="gold-text">CHARLES</span></h1>
        <p>FULL STACK DEVELOPER | UI/UX DESIGNER</p>
      </section>

      {/* About Me Section */}
      <section id="about" className="section" style={{ background: '#151515' }}>
        <h2 style={{ borderBottom: '2px solid #ffcc00', display: 'inline-block', paddingBottom: '10px' }}>About Me</h2>
        <p style={{ marginTop: '20px', color: '#999', maxWidth: '800px', margin: '20px auto' }}>
          Passionate developer with a focus on creating clean, elegant, and functional digital experiences.
        </p>
      </section>

      {/* Works / Gallery Section */}
      <section id="works" className="section">
        <h2>My <span className="gold-text">Works</span></h2>
        <div className="grid-layout">
          <div className="card">
            <img src="https://via.placeholder.com/300x200" alt="Project" />
            <div style={{ padding: '15px' }}><h3>Project Name</h3><p>Web Design</p></div>
          </div>
          <div className="card">
            <img src="https://via.placeholder.com/300x200" alt="Project" />
            <div style={{ padding: '15px' }}><h3>Project Name</h3><p>App Development</p></div>
          </div>
        </div>
      </section>

      {/* Leave a Comment Section */}
      <section id="connect" className="section" style={{ background: '#151515' }}>
        <h2>LEAVE A <span className="gold-text">COMMENT</span></h2>
        
        <form className="connect-form" onSubmit={handlePost}>
          <input 
            type="text" 
            placeholder="USERNAME" 
            value={user} 
            onChange={(e) => setUser(e.target.value)} 
          />
          <textarea 
            placeholder="YOUR MESSAGE / COMMENT" 
            rows="5" 
            value={msg} 
            onChange={(e) => setMsg(e.target.value)}
          ></textarea>
          <button type="submit">POST COMMENT</button>
        </form>

        {/* Displaying Comments from Supabase */}
        <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'left' }}>
          {comments.map((c) => (
            <div key={c.id} style={{ borderBottom: '1px solid #333', padding: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: '#ffcc00', fontWeight: 'bold' }}>@{c.username}</span>
                <span style={{ color: '#666', fontSize: '0.8rem' }}>
                  {new Date(c.created_at).toLocaleDateString()} at {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p style={{ color: '#ccc' }}>{c.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;