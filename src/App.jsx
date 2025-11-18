import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const [loading, setLoading] = useState(false)
  // Minimal estimator: only quantity input. Price is fixed.
  const [qty, setQty] = useState(5)
  const PRICE_PER_ITEM = 10

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    setLoading(true)
    const { data, error } = await supabase.from('messages').select('*').order('id', { ascending: false }).limit(10)
    if (error) {
      console.error('Supabase fetch error:', error)
    } else {
      setMessages(data || [])
    }
    setLoading(false)
  }

  async function addMessage(e) {
    e.preventDefault()
    if (!newMsg) return
    const { error } = await supabase.from('messages').insert([{ text: newMsg }])
    if (error) console.error('Insert error:', error)
    else {
      setNewMsg('')
      fetchMessages()
    }
  }

  return (
    <div className="site">
      <nav className="nav">
        <div className="nav-inner">
          <div className="brand">Virtual<span className="accent">Consultation</span></div>
          <a className="cta" href="#messages">Messages</a>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-inner">
          <h1>Build Fast, Ship Faster</h1>
          <p className="lead">A tiny starter using Vite + React — backed by Supabase. Add content, authentication, and deploy to Vercel in minutes.</p>
          <div className="hero-ctas">
            <a className="btn primary" href="#messages">Try Messages</a>
            <a className="btn" href="https://supabase.com" target="_blank" rel="noreferrer">Supabase</a>
          </div>
        </div>
      </header>

      <section className="features container">
        <div className="feature">
          <h3>Fast dev</h3>
          <p>Hot reload and tiny builds with Vite for a smooth developer experience.</p>
        </div>
        <div className="feature">
          <h3>Hosted backend</h3>
          <p>Use Supabase for database, auth, and edge functions — configured in minutes.</p>
        </div>
        <div className="feature">
          <h3>Deployable</h3>
          <p>One-click deploy to Vercel. Add env vars and push to GitHub to publish.</p>
        </div>
      </section>

      <section className="estimator-min container">
        <div className="estimator-min-inner">
          <div className="estimator-left">
            <h2>Cost Estimator</h2>
            <p className="muted">Enter a quantity and see the total. Price per item is <strong>${PRICE_PER_ITEM}</strong>.</p>
          </div>

          <div className="estimator-right">
            <label className="qty-label">Quantity</label>
            <input className="qty-input" type="number" min="0" value={qty} onChange={e => setQty(Number(e.target.value || 0))} />
            <div className="estimator-total-big">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(qty * PRICE_PER_ITEM)}</div>
            <button type="button" className="btn primary" onClick={() => setQty(5)}>Example: 5</button>
          </div>
        </div>
      </section>

      <main className="container" id="messages">
        <h2>Messages</h2>
        <p className="muted">Send a quick message to test your Supabase connection.</p>

        <form onSubmit={addMessage} className="message-form">
          <input value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Write a message" />
          <button type="submit">Send</button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="messages">
            {messages.length === 0 && <li>No messages yet.</li>}
            {messages.map(m => (
              <li key={m.id}>{m.text}</li>
            ))}
          </ul>
        )}
      </main>

      <footer className="site-footer">
        <div className="container">© {new Date().getFullYear()} Virtual Consultation — Deployed with Vercel • Backend: Supabase</div>
      </footer>
    </div>
  )
}
