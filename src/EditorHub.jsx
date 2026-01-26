import React from 'react';
import { Link } from 'react-router-dom';
import './Editor.css';

const EditorHub = () => {
  return (
    <div className="editor-page">
      <div className="editor-card">
        <div className="editor-header">
          <div className="editor-title">
            <img src="/dd_icon_rgb.png" alt="" height={32} />
            <div>
              <h1>Editor Hub</h1>
              <div className="editor-meta">
                <span className="pill">/editor</span>
                <span className="muted">Vælg en editor at arbejde med</span>
              </div>
            </div>
          </div>
        </div>

        <div className="editor-hub-grid">
          <Link to="/editor/menu" className="editor-hub-card">
            <h2>Menu Editor</h2>
            <p>Redigér menu items og regeneration flags</p>
            <span className="pill">/editor/menu</span>
          </Link>

          <Link to="/editor/modifiers" className="editor-hub-card">
            <h2>Food Modifier Editor</h2>
            <p>Opret, opdater eller slet modifiers</p>
            <span className="pill">/editor/modifiers</span>
          </Link>

          <Link to="/editor/surveillance" className="editor-hub-card">
            <h2>Surveillance Editor</h2>
            <p>Opret, opdater eller slet surveillance entries</p>
            <span className="pill">/editor/surveillance</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditorHub;
