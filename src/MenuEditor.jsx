import React from 'react';
import { Link } from 'react-router-dom';
import './Editor.css';

const initialFlags = {
  regenerateImages: false,
  regenerateDescriptions: false,
  regenerateNames: false,
  regenerateRecipe: false,
  regenerateFoodContents: false
};

const MenuEditor = () => {
  const [menuItems, setMenuItems] = React.useState([]);
  const [modifiers, setModifiers] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState(null);
  const [form, setForm] = React.useState({
    correctedFoodName: '',
    veganizedFoodName: '',
    description: '',
    veganizedDescription: '',
    recipe: '',
    foodModifierId: ''
  });
  const [flags, setFlags] = React.useState(initialFlags);
  const [status, setStatus] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const selectedItem = menuItems.find((m) => m.id === selectedId) || null;

  const loadMenu = React.useCallback(() => {
    fetch('/api/menu')
      .then((r) => r.json())
      .then((data) => setMenuItems(data || []))
      .catch((err) => setStatus({ type: 'error', message: `Kunne ikke hente menu: ${err.message}` }));
  }, []);

  const loadModifiers = React.useCallback(() => {
    fetch('/api/FoodModifier')
      .then((r) => r.json())
      .then((data) => setModifiers(data || []))
      .catch((err) => setStatus({ type: 'error', message: `Kunne ikke hente modifiers: ${err.message}` }));
  }, []);

  React.useEffect(() => {
    loadMenu();
    loadModifiers();
  }, [loadMenu, loadModifiers]);

  React.useEffect(() => {
    if (!selectedItem) return;
    setForm({
      correctedFoodName: selectedItem.correctedFoodName || '',
      veganizedFoodName: selectedItem.veganizedFoodName || '',
      description: selectedItem.description || '',
      veganizedDescription: selectedItem.veganizedDescription || '',
      recipe: selectedItem.recipe || '',
      foodModifierId: selectedItem.foodModifier?.id || ''
    });
    setFlags(initialFlags);
    setStatus(null);
  }, [selectedItem]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateFlag = (field, value) => {
    setFlags((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    setLoading(true);
    setStatus({ type: 'info', message: 'Gemmer ændringer...' });

    const body = {
      ...flags,
      correctedFoodName: form.correctedFoodName || undefined,
      veganizedFoodName: form.veganizedFoodName || undefined,
      description: form.description || undefined,
      veganizedDescription: form.veganizedDescription || undefined,
      recipe: form.recipe || undefined,
      foodModifierId: form.foodModifierId || null
    };

    try {
      const res = await fetch(`/api/Menu/${selectedItem.date}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Uventet fejl');
      }

      setStatus({ type: 'success', message: 'Menuen blev opdateret.' });
      loadMenu();
    } catch (err) {
      setStatus({ type: 'error', message: `Fejl ved opdatering: ${err.message}` });
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
              <h1>Menu Editor</h1>
              <div className="editor-meta">
                <span className="pill">/editor/menu</span>
                <span className="muted">Redigér menu items og regeneration flags</span>
              </div>
            </div>
          </div>
          <div className="editor-nav">
            <Link className="btn btn-secondary" to="/editor/modifiers">Gå til modifiers</Link>
          </div>
        </div>

        <div className="editor-layout">
          <div className="editor-list">
            <div className="editor-list-header">Menu</div>
            <div className="editor-list-items">
              {menuItems.length === 0 && <div className="editor-empty">Ingen menu-data fundet.</div>}
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className={`editor-list-item ${selectedId === item.id ? 'active' : ''}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <h3>{item.foodDisplayName || item.correctedFoodName || item.foodName || 'Ukendt ret'}</h3>
                  <small>{item.day} • {item.date}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="editor-form">
            {selectedItem ? (
              <form onSubmit={handleSubmit}>
                <div className="split-header">
                  <div>
                    <h2>{selectedItem.foodDisplayName || selectedItem.correctedFoodName || selectedItem.foodName}</h2>
                    <div className="editor-meta">
                      <span className="badge">Dato: {selectedItem.date}</span>
                      <span className="badge">Uge {selectedItem.weekNumber}</span>
                      {selectedItem.foodModifier?.title && <span className="badge">Modifier: {selectedItem.foodModifier.title}</span>}
                    </div>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="correctedFoodName">Korrigeret navn</label>
                    <input
                      id="correctedFoodName"
                      value={form.correctedFoodName}
                      onChange={(e) => updateForm('correctedFoodName', e.target.value)}
                      placeholder="Fx: Krydret kylling med ris"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="veganizedFoodName">Vegansk navn</label>
                    <input
                      id="veganizedFoodName"
                      value={form.veganizedFoodName}
                      onChange={(e) => updateForm('veganizedFoodName', e.target.value)}
                      placeholder="Fx: Vegansk bolognese"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="foodModifier">Modifier</label>
                    <select
                      id="foodModifier"
                      value={form.foodModifierId}
                      onChange={(e) => updateForm('foodModifierId', e.target.value)}
                    >
                      <option value="">Ingen modifier</option>
                      {modifiers.map((mod) => (
                        <option key={mod.id} value={mod.id}>{mod.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="description">Beskrivelse</label>
                    <textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => updateForm('description', e.target.value)}
                      placeholder="Beskrivelse..."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="veganizedDescription">Vegansk beskrivelse</label>
                    <textarea
                      id="veganizedDescription"
                      value={form.veganizedDescription}
                      onChange={(e) => updateForm('veganizedDescription', e.target.value)}
                      placeholder="Vegansk beskrivelse..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="recipe">Opskrift (markdown)</label>
                  <textarea
                    id="recipe"
                    value={form.recipe}
                    onChange={(e) => updateForm('recipe', e.target.value)}
                    placeholder="## Ingredienser..."
                  />
                </div>

                <div className="section-title">Regenerering</div>
                <div className="checkbox-group">
                  {Object.keys(flags).map((key) => (
                    <label key={key} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={flags[key]}
                        onChange={(e) => updateFlag(key, e.target.checked)}
                      />
                      <span>{key}</span>
                    </label>
                  ))}
                </div>

                <div className="editor-actions">
                  <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Gemmer...' : 'Gem ændringer'}
                  </button>
                  <button className="btn btn-secondary" type="button" onClick={() => setFlags(initialFlags)} disabled={loading}>
                    Nulstil flags
                  </button>
                </div>

                {status && (
                  <div className={`status-bar ${status.type === 'error' ? 'status-error' : ''}`}>
                    {status.message}
                  </div>
                )}
              </form>
            ) : (
              <div className="editor-empty">Vælg et menu item for at redigere.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuEditor;