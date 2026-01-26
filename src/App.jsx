import Dashboard from './Dashboard';
import MenuEditor from './MenuEditor';
import ModifierEditor from './ModifierEditor';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SurveillanceEditor from './SurveillanceEditor.jsx';
import EditorHub from './EditorHub.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
          <Route path="/editor" element={<EditorHub />} />
          <Route path="/editor/menu" element={<MenuEditor />} />
          <Route path="/editor/modifiers" element={<ModifierEditor />} />
          <Route path="/editor/surveillance" element={<SurveillanceEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
