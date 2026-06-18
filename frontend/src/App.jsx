import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Tracker from './pages/Tracker';
import Signup from './pages/Signup';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/tracker" element={<Tracker />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;