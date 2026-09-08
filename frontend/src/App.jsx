import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [clientId, setClientId] = useState('')
  const [searchedClient, setSearchedClient] = useState(null)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')

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

  const normalizedSearchTerm = searchTerm.trim().toLowerCase()
  const filteredClients = clients.filter((client) =>
    [client.client_name, client.email, client.phone]
      .some((value) => value?.toLowerCase().includes(normalizedSearchTerm)),
  )

  const handleClientLookup = async (event) => {
    event.preventDefault()
    const trimmedClientId = clientId.trim()

    if (!trimmedClientId) {
      setLookupError('Enter a client ID to search.')
      setSearchedClient(null)
      return
    }

    setLookupLoading(true)
    setLookupError('')
    setSearchedClient(null)

    try {
      const response = await fetch(`http://localhost:8000/clients/${trimmedClientId}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No client found with that ID.')
        }
        throw new Error('Unable to look up the client.')
      }
      setSearchedClient(await response.json())
    } catch (err) {
      setLookupError(err.message || 'Unable to look up the client.')
    } finally {
      setLookupLoading(false)
    }
  }

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

      <section className="tools-grid">
        <div className="tool-card">
          <div className="tool-heading">
            <p className="eyebrow">Instant filter</p>
            <h2>Search directory</h2>
          </div>
          <label htmlFor="client-search">Name, email, or phone</label>
          <input
            id="client-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="e.g. alicia or 555-0101"
          />
          <p className="tool-hint">
            Showing {filteredClients.length} of {clients.length} clients
          </p>
        </div>

        <div className="tool-card">
          <div className="tool-heading">
            <p className="eyebrow">API lookup</p>
            <h2>Find by client ID</h2>
          </div>
          <form className="lookup-form" onSubmit={handleClientLookup}>
            <label htmlFor="client-id">Client ID</label>
            <div className="lookup-controls">
              <input
                id="client-id"
                type="number"
                min="1"
                value={clientId}
                onChange={(event) => setClientId(event.target.value)}
                placeholder="e.g. 42"
              />
              <button type="submit" className="secondary-button" disabled={lookupLoading}>
                {lookupLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
          {lookupError && <p className="tool-message error">{lookupError}</p>}
          {searchedClient && (
            <div className="lookup-result">
              <strong>{searchedClient.client_name}</strong>
              <span>{searchedClient.email}</span>
              <span>{searchedClient.phone || 'No phone number'}</span>
            </div>
          )}
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
          <>
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
                {filteredClients.map((client) => (
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
            {!filteredClients.length && (
              <p className="status-message">No clients match your search.</p>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default App
