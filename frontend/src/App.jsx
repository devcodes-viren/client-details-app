import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadClients = async () => {
      try {
        const response = await fetch('http://localhost:8000/clients')
        if (!response.ok) {
          throw new Error('Failed to fetch client data')
        }
        const data = await response.json()
        setClients(data)
      } catch (err) {
        setError(err.message || 'Unable to load clients')
      } finally {
        setLoading(false)
      }
    }

    loadClients()
  }, [])

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Client management</p>
          <h1>Client Details</h1>
        </div>
        <button type="button" className="primary-button">
          + Add Client
        </button>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <span>Total clients</span>
          <strong>{clients.length}</strong>
        </div>
        <div className="stat-card">
          <span>Active</span>
          <strong>{clients.filter((client) => client.status === 'active').length}</strong>
        </div>
        <div className="stat-card">
          <span>Pending</span>
          <strong>{clients.filter((client) => client.status === 'pending').length}</strong>
        </div>
      </section>

      <section className="table-card">
        <div className="table-header">
          <h2>Client directory</h2>
        </div>

        {loading ? (
          <p className="status-message">Loading client data...</p>
        ) : error ? (
          <p className="status-message error">{error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>City</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.client_name}</td>
                  <td>{client.email}</td>
                  <td>{client.phone || '—'}</td>
                  <td>{client.company || '—'}</td>
                  <td>{client.city || '—'}</td>
                  <td>
                    <span className={`status-pill ${client.status}`}>
                      {client.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

export default App
