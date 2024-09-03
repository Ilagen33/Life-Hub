import './App.css';
import MyFooter from './Components/Footer.jsx';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/landingPage/Home.jsx';
import ToDo from './Pages/To-Do.jsx';
import Food from './Pages/Food.jsx';
import Exercise from './Pages/Exercise.jsx';
import Login from './Pages/landingPage/Login.jsx';
import Register from './Pages/landingPage/Register.jsx';
import Dashboard from './Pages/dashboard/Dashboard.jsx';
import {AuthProvider} from './context/AuthContext.js';
import PrivateRoute from './Components/PrivateRoute.js';

function App() {
  return (
    <div className="App">
      <Router>

        <AuthProvider>

          <Routes>

            <Route path="/" element={<Home/>} />
            <Route path="/login" element= {<Login/>} />
            <Route path="/register" element= {<Register/>} />
            
            <Route path="/To-Do" element= {<PrivateRoute><ToDo/></PrivateRoute>} />
            <Route path="/Food" element= {<PrivateRoute><Food /></PrivateRoute>} />
            <Route path="/Exercise" element= {<PrivateRoute><Exercise /></PrivateRoute>} />
            <Route path="/Dashboard" element= {<PrivateRoute><Dashboard /></PrivateRoute>} />
          
          </Routes>
        
        </AuthProvider>
        
        <MyFooter/>
      </Router>
    </div>
  );
}

export default App;
