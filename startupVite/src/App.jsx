import { BrowserRouter, Route, Routes, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './app.css';

import Login from './login/login';
import Question from './question/question';
import Progress from './progress/progress';
import Chat from './chat/chat';
import Welcome from './welcome/welcome';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <h1>Bondly</h1>
          <nav>
            <menu>
              {!isLoggedIn && (
                <NavLink to="/" className={({ isActive }) => isActive ? 'active' : 'inactive'}>
                  Login
                </NavLink>
              )}
              {isLoggedIn && (
                <>
                  <NavLink to="/welcome" className={({ isActive }) => isActive ? 'active' : 'inactive'}>
                    Home
                  </NavLink>
                  <NavLink to="/question" className={({ isActive }) => isActive ? 'active' : 'inactive'}>
                    Question
                  </NavLink>
                  <NavLink to="/progress" className={({ isActive }) => isActive ? 'active' : 'inactive'}>
                    Progress
                  </NavLink>
                  <NavLink to="/chat" className={({ isActive }) => isActive ? 'active' : 'inactive'}>
                    Chat
                  </NavLink>
                 
                </>
              )}
            </menu>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          {isLoggedIn && (
            <>
              <Route path="/question" element={<Question />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/welcome" element={<Welcome setIsLoggedIn={setIsLoggedIn} />} />
            </>
          )}
        </Routes>

        <footer>
          <div>
            Phoebe Chen
            <br />
            <a href="https://github.com/phoebeyuchen/startup">GitHub</a>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}


export default App;
