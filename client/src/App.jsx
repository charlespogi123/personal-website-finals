import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

// Initialize Supabase Client
const supabase = createClient(
  'https://mfqubfjakdfsmsszaxai.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mcXViZmpha2Rmc21zc3pheGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NjkxODcsImV4cCI6MjA4NzI0NTE4N30.Q7VjclZFeK9kjV1qohE4iLTilOJlVS0o10b8OYqG8PM'
);

function App() {
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState('');
  const [msg, setMsg] = useState('');
  const [connections, setConnections] = useState([]);

  // Modal States
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Form States
  const [newFriendName, setNewFriendName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchData = async () => {
    try {
      // Fetch Chat
      const res = await fetch(`${BACKEND_URL}/comments`);
      if (res.ok) setComments(await res.json());

      // Fetch Connections
      const { data, error } = await supabase
        .from('connections')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setConnections(data);
      if (error) console.error(error);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!newFriendName) return alert("Please enter a name!");
    setIsUploading(true);

    let finalImgUrl = 'https://tr.rbxcdn.com/30day-avatarheadshot/150/150/AvatarHeadshot/Png';

    try {
      if (selectedFile) {
        const fileName = `${Date.now()}-${selectedFile.name}`;
        const { error: upErr } = await supabase.storage.from('avatars').upload(fileName, selectedFile);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        finalImgUrl = data.publicUrl;
      }

      const { error: dbErr } = await supabase
        .from('connections')
        .insert([{ 
          name: newFriendName, 
          image_url: finalImgUrl,
          description: newDescription 
        }]);

      if (dbErr) throw dbErr;

      // Reset
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

  const openProfile = (friend) => {
    setSelectedProfile(friend);
    setShowProfileModal(true);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!user || !msg) return alert("Fill in both!");
    try {
      await fetch(`${BACKEND_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, content: msg }),
      });
      setUser(''); setMsg('');
      fetchData();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="charblox-container">
      {/* MODAL: CONNECT */}
      {showConnectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Connect with Charles</h3>
            <form onSubmit={handleConnect}>
              <label>Your Name</label>
              <input type="text" placeholder="Username..." value={newFriendName} onChange={(e) => setNewFriendName(e.target.value)} required />
              
              <label>About You (Description)</label>
              <textarea 
                className="modal-textarea" 
                placeholder="What's on your mind?" 
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />

              <label>Profile Photo</label>
              <input type="file" accept="image/*" className="file-input" onChange={(e) => setSelectedFile(e.target.files[0])} />
              
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowConnectModal(false)}>Cancel</button>
                <button type="submit" className="save-btn" disabled={isUploading}>{isUploading ? 'Uploading...' : 'Connect!'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW PROFILE */}
      {showProfileModal && selectedProfile && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content profile-card" onClick={e => e.stopPropagation()}>
            <div className="profile-header">
              <div className="profile-avatar-large">
                <img src={selectedProfile.image_url} alt={selectedProfile.name} />
              </div>
              <h2>{selectedProfile.name}</h2>
            </div>
            <div className="profile-body">
              <label>Description</label>
              <div className="description-box">
                {selectedProfile.description || "No description provided."}
              </div>
            </div>
            <button className="cancel-btn full-width" onClick={() => setShowProfileModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <header className="charblox-nav">
        <div className="nav-left"><h1 className="logo">CHARBLOX</h1></div>
        <div className="nav-search-container"><input type="text" placeholder="Search Experiences" className="nav-search-input" /></div>
        <div className="nav-right">
          <span className="robux-count">⏣ 1M+</span>
          <div className="user-settings">⚙️</div>
        </div>
      </header>

      <main className="main-content">
        <section className="charblox-hero">
          <div className="avatar-circle">
            <img src="https://tr.rbxcdn.com/30day-avatarheadshot/150/150/AvatarHeadshot/Png" alt="Charles" />
          </div>
          <h2>Hello, <span className="username">Charles</span>!</h2>
        </section>

        <section className="charblox-section">
          <h3>Connections ({connections.length})</h3>
          <div className="friends-scroll">
            <div className="friend-item connect-trigger" onClick={() => setShowConnectModal(true)}>
              <div className="friend-img-placeholder connect-plus">+</div>
              <span className="friend-name">Connect!</span>
            </div>

            {connections.map((f) => (
              <div key={f.id} className="friend-item" onClick={() => openProfile(f)}>
                <div className="friend-img-placeholder">
                  <img src={f.image_url} alt={f.name} className="friend-avatar-img" />
                </div>
                <span className="friend-name">{f.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="charblox-section">
          <h3>Global Chat</h3>
          <div className="chat-box">
            <div className="chat-history">
              {comments.map((c) => (
                <div key={c.id} className="chat-line">
                  <span className="chat-author">[{c.username}]:</span>
                  <span className="chat-content">{c.content}</span>
                </div>
              ))}
            </div>
            <form className="chat-controls" onSubmit={handlePost}>
              <input type="text" placeholder="Name" className="chat-user-input" value={user} onChange={(e) => setUser(e.target.value)} />
              <div className="chat-input-wrapper">
                <input type="text" placeholder="Say something..." value={msg} onChange={(e) => setMsg(e.target.value)} />
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