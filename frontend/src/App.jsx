import { Navigate, Route, Routes } from "react-router-dom"
import { HomePage } from "./pages/home-page"
import { LoginPage } from "./pages/login-page"
import { ProfilePage } from "./pages/profile-page"
import {Toaster} from 'react-hot-toast';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const App = () => {
  const {authUser} = useContext(AuthContext);
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-cover ">
      <Toaster />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}