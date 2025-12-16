import Login from './pages/Login'
import './App.css'
import { Routes, Route, Router } from "react-router-dom";
import Home from './pages/Home';
import { ProtectedRoute, PublicRoute } from './services/ProtectedRoute'
import ChatList from './components/ChatList';
import Setting from './components/Setting';
import Profile from './components/Profile';
import Layout from './components/Layout';


function App() {

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path='/user-login' element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<Home />} >
          <Route path='/' element={<Layout />} />
          <Route path='/setting' element={<Setting />} />
          <Route path='/profile' element={<Profile />} />
        </Route >
      </Route>
    </Routes>
  )
}

export default App
