import Dashboard from './Dashboard';
import MenuEditor from './MenuEditor';
import ModifierEditor from './ModifierEditor';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/editor/menu" element={<MenuEditor />} />
        <Route path="/editor/modifiers" element={<ModifierEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
