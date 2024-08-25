import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { SecondPage } from './components/SecondPage';
import { HexGridPage } from './components/HexGridPage';
import { ChatPage } from './components/ChatPage';
// import { GamePage } from './components/GamePage';

const App = () => (
  <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/second">Second Page</Link>
          </li>
          <li>
            <Link to="/hex-grid">Hex Grid</Link>
          </li>
          <li>
            <Link to="/chat">Chat Page</Link>
          </li>
          {/* <li>
            <Link to="/game">Game Page</Link>
          </li> */}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/second" element={<SecondPage />} />
        <Route path="/hex-grid" element={<HexGridPage Page />} />
        <Route path="/chat" element={<ChatPage Page />} />
        {/* <Route path="/game" element={<GamePage Page />} /> */}
      </Routes>
    </div>
  </Router>
);

export default App;
