import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import ArtisanProfile from './pages/ArtisanProfile'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import ArtisanDashboard from './pages/ArtisanDashboard'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import CraftTrails from './pages/CraftTrails'
import Impact from './pages/Impact'
import TrackOrder from './pages/TrackOrder'
import Explore from './pages/Explore'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="artisans/:id" element={<ArtisanProfile />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="craft-trails" element={<CraftTrails />} />
          <Route path="explore" element={<Explore />} />
          <Route path="impact" element={<Impact />} />
          <Route path="track-order" element={<TrackOrder />} />
          <Route path="dashboard" element={<ArtisanDashboard />} />
          <Route path="dashboard/:artisanId" element={<ArtisanDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
