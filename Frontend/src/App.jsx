import { useEffect, useState } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/items')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => console.error("API Error:", err));
  }, []);

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading Campus Items...</div>;

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#1e293b', fontWeight: '800' }}>LostNFound Campus</h1>
        <p style={{ color: '#64748b' }}>A centralized system for reporting and recovering lost items.</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '24px', 
        maxWidth: '1100px', 
        margin: '0 auto' 
      }}>
        {items.length > 0 ? items.map(item => (
          <div key={item.id} style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: '1px solid #e2e8f0', transition: 'transform 0.2s' }}>
            <div style={{ padding: '24px' }}>
              <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '600' }}>{item.status}</span>
              <h3 style={{ marginTop: '16px', color: '#1e293b', fontSize: '1.25rem' }}>{item.title}</h3>
              <p style={{ color: '#475569', fontSize: '14px', marginBottom: '20px' }}>{item.description}</p>
              <div style={{ fontSize: '13px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <p><strong>Location:</strong> {item.location}</p>
                <p><strong>Category:</strong> {item.category}</p>
              </div>
              <button style={{ width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                View Details
              </button>
            </div>
          </div>
        )) : <p style={{textAlign: 'center', gridColumn: '1/-1'}}>No items found yet.</p>}
      </div>
    </div>
  );
}

export default App;