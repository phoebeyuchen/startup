import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import { useState } from 'react';
import './app.css';

import Login from './login/login';
import Question from './question/question';
import Progress from './progress/progress';
import Chat from './chat/chat';
import Home from './home/home';
import { AnswersProvider } from './AnswersContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

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
                  <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : 'inactive'}>
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

        <AnswersProvider>
          <Routes>
            <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} setUserEmail={setUserEmail} />} />
            {isLoggedIn && (
              <>
                <Route path="/question" element={<Question />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/home" element={<Home setIsLoggedIn={setIsLoggedIn} userEmail={userEmail} />} />
              </>
            )}
          </Routes>
        </AnswersProvider>

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