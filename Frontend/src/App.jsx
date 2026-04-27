import { useEffect, useState } from 'react'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/items')
      .then(res => res.json())
      .then(data => {
        setItems(data)
        setLoading(false)
      })
      .catch(err => console.error("Eroare la API:", err))
  }, [])

  if (loading) return <div>Se încarcă obiectele...</div>

  return (
    <div style={{ padding: '20px' }}>
      <h1>LostNFound Campus</h1>
      <div style={{ display: 'grid', gap: '10px' }}>
        {items.map(item => (
          <div key={item.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <small>Locație: {item.location} | Statut: {item.status}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App