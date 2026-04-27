import { useEffect, useState } from 'react';
import { styles } from './App.styles';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', location: '', status: 'found', contact_info: ''
  });

  const fetchItems = (status = '') => {
    setLoading(true);
    const url = status ? `http://localhost:8000/items?status=${status}` : 'http://localhost:8000/items';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        // SORTEAZA: Cele mai noi obiecte (ID mare) apar primele
        const sorted = data.sort((a, b) => b.id - a.id);
        setItems(sorted);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFilterChange = (e) => {
    const val = e.target.value;
    setStatusFilter(val);
    fetchItems(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => {
      if (res.ok) {
        alert('Item successfully logged into archive.');
        setFormData({ title: '', description: '', category: '', location: '', status: 'found', contact_info: '' });
        setShowForm(false);
        fetchItems(statusFilter);
      }
    });
  };

  const applyHover = (e, isHover) => {
    Object.assign(e.target.style, isHover ? styles.buttonHover : styles.button);
  };

  return (
    <div style={styles.appContainer}>
      {/* Background blobs blurate */}
      <div style={{ position: 'fixed', top: '-5%', left: '-5%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'rgba(193, 164, 97, 0.12)', filter: 'blur(150px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'fixed', bottom: '-10%', right: '-5%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'rgba(48, 54, 61, 0.3)', filter: 'blur(180px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <h1 style={styles.logoText}>LNF</h1>
          <span style={styles.logoSub}>Campus Recovery</span>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          style={styles.toggleFormBtn}
          onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover, {backgroundColor: 'transparent', color: '#C1A461'})}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.toggleFormBtn)}
        >
          {showForm ? 'CLOSE PORTAL' : 'REPORT ITEM'}
        </button>
      </header>

      <section style={styles.heroSection}>
        <h1 style={styles.heroTitle}>LOST<span style={{ fontWeight: '200', color: '#FFF' }}>N</span>FOUND</h1>
        <p style={styles.heroSubtitle}>Bridging the gap between lost and returned.</p>
        <div style={styles.divider}></div>

        {/* Filtrul apare aici DOAR cand formularul este inchis */}
        {!showForm && (
          <div style={styles.filterContainer}>
            <span>DATABASE FILTER:</span>
            <select style={styles.filterSelect} value={statusFilter} onChange={handleFilterChange}>
              <option value="">ALL RECORDS</option>
              <option value="lost">LOST</option>
              <option value="found">FOUND</option>
            </select>
          </div>
        )}
      </section>

      {showForm && (
        <div style={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <input style={styles.input} placeholder="Item Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
            <textarea style={{ ...styles.input, height: '80px', resize: 'none' }} placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            <div style={{ display: 'flex', gap: '15px' }}>
              <input style={styles.input} placeholder="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
              <input style={styles.input} placeholder="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
            </div>
            <select style={styles.input} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
              <option value="found">FOUND AN ITEM</option>
              <option value="lost">LOST AN ITEM</option>
            </select>
            <input style={styles.input} placeholder="Contact Detail" value={formData.contact_info} onChange={e => setFormData({ ...formData, contact_info: e.target.value })} />
            <button 
              type="submit" 
              style={styles.button}
              onMouseEnter={(e) => applyHover(e, true)}
              onMouseLeave={(e) => applyHover(e, false)}
            >
              Confirm Submission
            </button>
          </form>

          {/* Filtrul se muta SUB formular cand acesta este deschis */}
          <div style={{...styles.filterContainer, borderTop: `1px solid #30363D`, marginTop: '30px'}}>
            <span>FILTER WHILE REPORTING:</span>
            <select style={styles.filterSelect} value={statusFilter} onChange={handleFilterChange}>
              <option value="">ALL RECORDS</option>
              <option value="lost">LOST</option>
              <option value="found">FOUND</option>
            </select>
          </div>
        </div>
      )}

      <div style={{...styles.grid, position: 'relative', zIndex: 1}}>
        {items.map(item => (
          <div 
            key={item.id} 
            style={{...styles.card, borderColor: hoveredId === item.id ? '#C1A461' : '#30363D', transform: hoveredId === item.id ? 'translateY(-5px)' : 'none'}}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setSelectedItem(item)}
          >
            <div style={styles.statusBadge(item.status)}>{item.status}</div>
            <h3 style={{margin: '0 0 10px 0', fontSize: '1.4rem'}}>{item.title}</h3>
            <p style={{fontSize: '0.9rem', color: '#8B949E'}}>📍 {item.location}</p>
            <button 
              style={styles.button}
              onMouseEnter={(e) => applyHover(e, true)}
              onMouseLeave={(e) => applyHover(e, false)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div style={styles.modalOverlay} onClick={() => setSelectedItem(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.statusBadge(selectedItem.status)}>{selectedItem.status}</div>
            <h2 style={{color: '#C1A461', fontSize: '2rem', margin: '10px 0 25px 0'}}>{selectedItem.title}</h2>
            <div style={{lineHeight: '1.8', fontSize: '1rem'}}>
              <p><strong>Description:</strong> {selectedItem.description || 'No data'}</p>
              <p><strong>Category:</strong> {selectedItem.category || 'N/A'}</p>
              <p><strong>Location:</strong> {selectedItem.location}</p>
              <p><strong>Contact:</strong> {selectedItem.contact_info}</p>
              
              {/* DATA SI ORA ADAUGATE SUBTIL */}
              <span style={styles.timestampText}>
                Added on: {new Date(selectedItem.created_at).toLocaleDateString('ro-RO')} at {new Date(selectedItem.created_at).toLocaleTimeString('ro-RO', {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
            <button 
              style={{ ...styles.button, backgroundColor: '#30363D', color: '#FFF', marginTop: '30px' }} 
              onClick={() => setSelectedItem(null)}
            >
              Return to Archive
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;