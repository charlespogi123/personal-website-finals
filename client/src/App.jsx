import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

// Initialize Supabase Client
const supabase = createClient(
  'https://mfqubfjakdfsmsszaxai.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mcXViZmpha2Rmc21zc3pheGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NjkxODcsImV4cCI6MjA4NzI0NTE4N30.Q7VjclZFeK9kjV1qohE4iLTilOJlVS0o10b8OYqG8PM'
);

function App() {
  // State Management
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState('');
  const [msg, setMsg] = useState('');
  const [connections, setConnections] = useState([]);
  const [experiences, setExperiences] = useState([]);

  // UI State
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [viewType, setViewType] = useState('');

  // Form State
  const [newFriendName, setNewFriendName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Connection URL: Priority to .env for Codespaces/Vercel
  const BACKEND_URL = 'https://potential-orbit-jj4q97qvp9ppc56p9-3000.app.github.dev/' || 'http://localhost:3000';

  const fetchData = async () => {
    try {
      // 1. Fetch Comments from NestJS Backend
      const res = await fetch(`${BACKEND_URL}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }

      // 2. Fetch Connections from Supabase
      const { data: conns } = await supabase
        .from('connections')
        .select('*')
        .order('created_at', { ascending: false });
      if (conns) setConnections(conns);

      // 3. Fetch Experiences from Supabase
      const { data: exps } = await supabase
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: true });
      if (exps) setExperiences(exps);
    } catch (e) {
      console.error("Fetch Error:", e);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh chat every 10 seconds
    const timer = setInterval(fetchData, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleConnect = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    let finalImgUrl = 'https://tr.rbxcdn.com/30day-avatarheadshot/150/150/AvatarHeadshot/Png';

    try {
      if (selectedFile) {
        const fileName = `${Date.now()}-${selectedFile.name}`;
        await supabase.storage.from('avatars').upload(fileName, selectedFile);
        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        finalImgUrl = data.publicUrl;
      }

      await supabase.from('connections').insert([
        { name: newFriendName, image_url: finalImgUrl, description: newDescription }
      ]);

      setNewFriendName('');
      setNewDescription('');
      setSelectedFile(null);
      setShowConnectModal(false);
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!user || !msg) return alert('Fill in both fields!');

    try {
      const response = await fetch(`${BACKEND_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, content: msg })
      });

      if (response.ok) {
        setUser('');
        setMsg('');
        fetchData();
      }
    } catch (e) {
      console.error("Chat Post Error:", e);
    }
  };

  const openDetails = (item, type) => {
    setActiveItem(item);
    setViewType(type);
    setShowDetailsModal(true);
  };

  return (
    <div className="charblox-app">
      {/* MODAL: CONNECT */}
      {showConnectModal && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header"><h3>Connect with Charles</h3></div>
            <form onSubmit={handleConnect} className="modal-body">
              <div className="input-group">
                <label>Your Name</label>
                <input type="text" placeholder="Username..." value={newFriendName} onChange={(e) => setNewFriendName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Bio (Optional)</label>
                <textarea placeholder="Tell us about yourself..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Profile Photo</label>
                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowConnectModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={isUploading}>{isUploading ? 'Uploading...' : 'Connect!'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETAILS */}
      {showDetailsModal && activeItem && (
        <div className="modal-backdrop" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-container detail-view" onClick={e => e.stopPropagation()}>
            {viewType === 'experience' ? (
              <div className="exp-detail">
                <div className="detail-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), #191B1D), url(${activeItem.image_url || 'https://via.placeholder.com/300'})` }}>
                   <h2>{activeItem.title}</h2>
                </div>
                <div className="detail-content">
                   <div className="detail-meta">👍 {activeItem.rating}% | 👥 {activeItem.playing || 0} Playing</div>
                   <p>{activeItem.description || "No description provided."}</p>
                   <button className="btn-play">Play</button>
                </div>
              </div>
            ) : (
              <div className="profile-detail">
                <img src={activeItem.image_url} className="large-avatar" alt={activeItem.name} />
                <h2>{activeItem.name}</h2>
                <div className="bio-container">
                   <label>About</label>
                   <p>{activeItem.description || "This user is a mystery."}</p>
                </div>
              </div>
            )}
            <div className="detail-footer">
              <button className="btn-secondary" onClick={() => setShowDetailsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <header className="navbar">
        <div className="nav-container">
          <h1 className="brand">CHARBLOX</h1>
          <div className="search-bar">
            <input type="text" placeholder="Search experiences..." />
          </div>
          <div className="nav-icons">
            <span>⏣ 1M+</span>
            <span>⚙️</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="container">
        <section className="hero">
          <div className="hero-avatar">
            <img src="https://tr.rbxcdn.com/30day-avatarheadshot/150/150/AvatarHeadshot/Png" alt="Charles" />
          </div>
          <h2>Hello, <span>Charles</span>!</h2>
        </section>

        {/* CONNECTIONS SECTION */}
        <section className="section">
          <div className="section-head">
            <h3>Connections ({connections.length})</h3>
            <span className="see-all">See All →</span>
          </div>
          <div className="scroll-row">
            <div className="friend-card add-card" onClick={() => setShowConnectModal(true)}>
              <div className="circle-thumb plus-icon">+</div>
              <span className="name">Connect</span>
            </div>
            {connections.map(f => (
              <div key={f.id} className="friend-card" onClick={() => openDetails(f, 'profile')}>
                <div className="circle-thumb"><img src={f.image_url} alt={f.name} /></div>
                <span className="name">{f.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* EXPERIENCES GRID */}
        <section className="section">
          <div className="section-head">
            <h3>My Experiences</h3>
            <span className="see-all">See All →</span>
          </div>
          <div className="experience-grid">
            {experiences.map(exp => (
              <div key={exp.id} className="game-card" onClick={() => openDetails(exp, 'experience')}>
                <div className="game-thumb">
                  <img src={exp.image_url || 'https://via.placeholder.com/150'} alt={exp.title} />
                </div>
                <div className="game-meta">
                  <span className="game-title">{exp.title}</span>
                  <span className="game-rating">👍 {exp.rating}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GLOBAL CHAT */}
        <section className="section">
          <h3>Global Chat</h3>
          <div className="chat-window">
            <div className="chat-log">
              {comments.length === 0 ? <p className="chat-empty">No messages yet. Say hi!</p> : comments.map(c => (
                <div key={c.id} className="chat-msg">
                  <span className="author">[{c.username}]:</span> {c.content}
                </div>
              ))}
            </div>
            <form className="chat-input-area" onSubmit={handlePost}>
              <input type="text" placeholder="Name" value={user} onChange={(e) => setUser(e.target.value)} className="name-input" />
              <div className="msg-row">
                <input type="text" placeholder="Say something..." value={msg} onChange={(e) => setMsg(e.target.value)} />
                <button type="submit">Send</button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;