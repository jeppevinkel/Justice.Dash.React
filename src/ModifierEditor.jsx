import React from 'react';
import { Link } from 'react-router-dom';
import './Editor.css';

const emptyModifier = { title: '', description: '' };

const ModifierEditor = () => {
  const [modifiers, setModifiers] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState(null);
  const [form, setForm] = React.useState(emptyModifier);
  const [status, setStatus] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const loadModifiers = React.useCallback(() => {
    fetch('/api/FoodModifier')
      .then((r) => r.json())
      .then((data) => setModifiers(data || []))
      .catch((err) => setStatus({ type: 'error', message: `Kunne ikke hente modifiers: ${err.message}` }));
  }, []);

  React.useEffect(() => {
    loadModifiers();
  }, [loadModifiers]);

  React.useEffect(() => {
    if (!selectedId) {
      setForm(emptyModifier);
      return;
    }
    const mod = modifiers.find((m) => m.id === selectedId);
    if (mod) {
      setForm({ title: mod.title || '', description: mod.description || '' });
    }
  }, [selectedId, modifiers]);

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: 'info', message: 'Gemmer...' });

    const isNew = selectedId === 'new';
    const endpoint = isNew ? '/api/FoodModifier' : `/api/FoodModifier/${selectedId}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description
        })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Uventet fejl');
      }

      setStatus({ type: 'success', message: isNew ? 'Modifier oprettet.' : 'Modifier opdateret.' });
      setSelectedId(null);
      setForm(emptyModifier);
      loadModifiers();
    } catch (err) {
      setStatus({ type: 'error', message: `Fejl: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!id) return;
    if (!window.confirm('Slet modifier?')) return;
    setLoading(true);
    setStatus({ type: 'info', message: 'Sletter...' });

    try {
      const res = await fetch(`/api/FoodModifier/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) {
        const text = await res.text();
        throw new Error(text || 'Uventet fejl');
      }
      setStatus({ type: 'success', message: 'Modifier slettet.' });
      if (selectedId === id) {
        setSelectedId(null);
        setForm(emptyModifier);
      }
      loadModifiers();
    } catch (err) {
      setStatus({ type: 'error', message: `Fejl: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-page">
      <div className="editor-card">
        <div className="editor-header">
          <div className="editor-title">
            <img src="/dd_icon_rgb.png" alt="" height={32} />
            <div>
              <h1>Food Modifier Editor</h1>
              <div className="editor-meta">
                <span className="pill">/editor/modifiers</span>
                <span className="muted">Opret, opdater eller slet modifiers</span>
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => { setSelectedId('new'); setForm(emptyModifier); setStatus(null); }}
          >
            Ny modifier
          </button>
          <div className="editor-nav">
            <Link className="btn btn-secondary" to="/editor/menu">Gå til menu</Link>
            <Link className="btn btn-secondary" to="/editor/surveillance">Gå til surveillance</Link>
          </div>
        </div>

        <div className="editor-layout">
          <div className="editor-list">
            <div className="editor-list-header">Modifiers</div>
            <div className="editor-list-items">
              {modifiers.length === 0 && <div className="editor-empty">Ingen modifiers fundet.</div>}
              {modifiers.map((mod) => (
                <div
                  key={mod.id}
                  className={`editor-list-item ${selectedId === mod.id ? 'active' : ''}`}
                  onClick={() => setSelectedId(mod.id)}
                >
                  <h3>{mod.title}</h3>
                  <small>{mod.description}</small>
                  <div className="modifier-actions">
                    <button className="btn btn-secondary" type="button" onClick={() => setSelectedId(mod.id)}>Redigér</button>
                    <button className="btn btn-danger" type="button" onClick={(e) => { e.stopPropagation(); remove(mod.id); }}>Slet</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="editor-form">
            <form onSubmit={save}>
              <div className="split-header">
                <div>
                  <h2>{selectedId === 'new' ? 'Ny modifier' : selectedId ? 'Redigér modifier' : 'Vælg en modifier'}</h2>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="title">Titel</label>
                  <input
                    id="title"
                    value={form.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    placeholder="Fx: Blue Theme"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Beskrivelse</label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => updateForm('description', e.target.value)}
                    placeholder="Hvordan maden præsenteres..."
                    required
                  />
                </div>
              </div>

              <div className="editor-actions">
                <button className="btn btn-primary" type="submit" disabled={loading || !form.title || !form.description}>
                  {loading ? 'Gemmer...' : 'Gem'}
                </button>
                <button className="btn btn-secondary" type="button" disabled={loading} onClick={() => { setSelectedId(null); setForm(emptyModifier); setStatus(null); }}>
                  Ryd
                </button>
              </div>

              {status && (
                <div className={`status-bar ${status.type === 'error' ? 'status-error' : ''}`}>
                  {status.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifierEditor;