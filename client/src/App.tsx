import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';


function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/emailVerify" element={<EmailVerify />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </>
  )
}

export default App;