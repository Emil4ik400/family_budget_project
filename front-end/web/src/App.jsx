import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import './css/App.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="login"/>} />
        <Route path ="/login" element={<Login/>} />
        <Route path ="/register" element={<Register/>} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;