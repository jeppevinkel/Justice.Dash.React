import React from 'react';
import { Link } from 'react-router-dom';
import './Editor.css';

const emptySurveillance = { type: 'MDM', week: '', year: new Date().getFullYear(), responsible: '' };

const SurveillanceEditor = () => {
  const [entries, setEntries] = React.useState({ MDM: [], EDI: [] });
  const [selectedId, setSelectedId] = React.useState(null);
  const [form, setForm] = React.useState(emptySurveillance);
  const [status, setStatus] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const loadSurveillance = React.useCallback(() => {
    fetch('/api/Surveillance')
      .then((r) => r.json())
      .then((data) => setEntries(data || { MDM: [], EDI: [] }))
      .catch((err) => setStatus({ type: 'error', message: `Kunne ikke hente surveillance: ${err.message}` }));
  }, []);

  React.useEffect(() => {
    loadSurveillance();
  }, [loadSurveillance]);

  React.useEffect(() => {
    if (!selectedId) {
      setForm(emptySurveillance);
      return;
    }
    const allEntries = [...entries.MDM, ...entries.EDI];
    const entry = allEntries.find((e) => e.id === selectedId);
    if (entry) {
      setForm({
        type: entry.type || 'MDM',
        week: entry.week || '',
        year: entry.year || new Date().getFullYear(),
        responsible: entry.responsible || ''
      });
    }
  }, [selectedId, entries]);

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: 'info', message: 'Gemmer...' });

    const isNew = selectedId === 'new';
    const endpoint = isNew ? '/api/Surveillance' : `/api/Surveillance/${selectedId}`;
    const method = isNew ? 'POST' : 'PUT';

    const body = {
      type: form.type,
      week: parseInt(form.week, 10),
      year: parseInt(form.year, 10),
      responsible: form.responsible
    };

    if (!isNew) {
      body.id = selectedId;
    }

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Uventet fejl');
      }

      setStatus({ type: 'success', message: isNew ? 'Surveillance oprettet.' : 'Surveillance opdateret.' });
      setSelectedId(null);
      setForm(emptySurveillance);
      loadSurveillance();
    } catch (err) {
      setStatus({ type: 'error', message: `Fejl: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!id) return;
    if (!window.confirm('Slet surveillance entry?')) return;
    setLoading(true);
    setStatus({ type: 'info', message: 'Sletter...' });

    try {
      const res = await fetch(`/api/Surveillance/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) {
        const text = await res.text();
        throw new Error(text || 'Uventet fejl');
      }
      setStatus({ type: 'success', message: 'Surveillance slettet.' });
      if (selectedId === id) {
        setSelectedId(null);
        setForm(emptySurveillance);
      }
      loadSurveillance();
    } catch (err) {
      setStatus({ type: 'error', message: `Fejl: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const allEntries = [...entries.MDM, ...entries.EDI].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    if (a.week !== b.week) return b.week - a.week;
    return a.type.localeCompare(b.type);
  });

  return (
    <div className="editor-page">
      <div className="editor-card">
        <div className="editor-header">
          <div className="editor-title">
            <img src="/dd_icon_rgb.png" alt="" height={32} />
            <div>
              <h1>Surveillance Editor</h1>
              <div className="editor-meta">
                <span className="pill">/editor/surveillance</span>
                <span className="muted">Opret, opdater eller slet surveillance entries</span>
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => { setSelectedId('new'); setForm(emptySurveillance); setStatus(null); }}
          >
            Ny surveillance
          </button>
          <div className="editor-nav">
            <Link className="btn btn-secondary" to="/editor/menu">Gå til menu</Link>
            <Link className="btn btn-secondary" to="/editor/modifiers">Gå til modifiers</Link>
          </div>
        </div>

        <div className="editor-layout">
          <div className="editor-list">
            <div className="editor-list-header">Surveillance</div>
            <div className="editor-list-items">
              {allEntries.length === 0 && <div className="editor-empty">Ingen surveillance entries fundet.</div>}
              {allEntries.map((entry) => (
                <div
                  key={entry.id}
                  className={`editor-list-item ${selectedId === entry.id ? 'active' : ''}`}
                  onClick={() => setSelectedId(entry.id)}
                >
                  <h3>{entry.type} - Uge {entry.week}, {entry.year}</h3>
                  <small>{entry.responsible}</small>
                  <div className="modifier-actions">
                    <button className="btn btn-secondary" type="button" onClick={() => setSelectedId(entry.id)}>Redigér</button>
                    <button className="btn btn-danger" type="button" onClick={(e) => { e.stopPropagation(); remove(entry.id); }}>Slet</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="editor-form">
            <form onSubmit={save}>
              <div className="split-header">
                <div>
                  <h2>{selectedId === 'new' ? 'Ny surveillance' : selectedId ? 'Redigér surveillance' : 'Vælg en surveillance'}</h2>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="type">Type</label>
                  <select
                    id="type"
                    value={form.type}
                    onChange={(e) => updateForm('type', e.target.value)}
                    required
                  >
                    <option value="MDM">MDM</option>
                    <option value="EDI">EDI</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="week">Uge</label>
                  <input
                    id="week"
                    type="number"
                    min="1"
                    max="53"
                    value={form.week}
                    onChange={(e) => updateForm('week', e.target.value)}
                    placeholder="1-53"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="year">År</label>
                  <input
                    id="year"
                    type="number"
                    min="2020"
                    max="2100"
                    value={form.year}
                    onChange={(e) => updateForm('year', e.target.value)}
                    placeholder="2024"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="responsible">Ansvarlig</label>
                  <input
                    id="responsible"
                    value={form.responsible}
                    onChange={(e) => updateForm('responsible', e.target.value)}
                    placeholder="Navn på ansvarlig person"
                    required
                  />
                </div>
              </div>

              <div className="editor-actions">
                <button className="btn btn-primary" type="submit" disabled={loading || !form.week || !form.year || !form.responsible}>
                  {loading ? 'Gemmer...' : 'Gem'}
                </button>
                <button className="btn btn-secondary" type="button" disabled={loading} onClick={() => { setSelectedId(null); setForm(emptySurveillance); setStatus(null); }}>
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

export default SurveillanceEditor;
