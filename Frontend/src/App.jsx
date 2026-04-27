import { useEffect, useState } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedItem, setSelectedItem] = useState(null);

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
      
      {selectedItem && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', 
          justifyContent: 'center', alignItems: 'center', zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{ 
            backgroundColor: 'white', padding: '32px', borderRadius: '20px', 
            maxWidth: '550px', width: '90%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#1e293b' }}>{selectedItem.title}</h2>
              <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 'bold' }}>
                {selectedItem.status}
              </span>
            </div>
            
            <div style={{ display: 'grid', gap: '16px', color: '#475569' }}>
              <p><strong>📝 Description:</strong> {selectedItem.description || "No description provided."}</p>
              <p><strong>📍 Location:</strong> {selectedItem.location}</p>
              <p><strong>📂 Category:</strong> {selectedItem.category}</p>
              <p><strong>📧 Contact Info:</strong> {selectedItem.contact_info || "Contact office at PII3"}</p>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '10px' }}>
                Reported on: {new Date(selectedItem.created_at).toLocaleString('ro-RO')}
              </p>
            </div>

            <button 
              onClick={() => setSelectedItem(null)}
              style={{ 
                width: '100%', marginTop: '30px', padding: '12px', 
                backgroundColor: '#1e293b', color: 'white', border: 'none', 
                borderRadius: '10px', fontWeight: '600', cursor: 'pointer' 
              }}
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      <header style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#1e293b', fontWeight: '800' }}>LostNFound Campus</h1>
        <p style={{ color: '#64748b' }}>A centralized system for reporting and recovering lost items.</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '24px', maxWidth: '1100px', margin: '0 auto' 
      }}>
        {items.length > 0 ? items.map(item => (
          <div key={item.id} style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '24px' }}>
              <h3 style={{ color: '#1e293b', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ color: '#64748b', fontSize: '14px', height: '40px', overflow: 'hidden' }}>{item.description}</p>
              
              <button 
                onClick={() => setSelectedItem(item)}
                style={{ 
                  width: '100%', marginTop: '20px', padding: '10px', 
                  backgroundColor: '#2563eb', color: 'white', border: 'none', 
                  borderRadius: '8px', fontWeight: '600', cursor: 'pointer' 
                }}
              >
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