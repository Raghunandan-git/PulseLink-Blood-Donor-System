import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Components/Home';
import Footer from './Components/Footer';
import Login from './Components/Login';
import Signup from './Components/Signup';
import FindBlood from './Components/FindBlood';
import BecomeDonor from './Components/BecomeDonor';
import AboutUs from './Components/AboutUs';
import AdminRoute from './routes/AdminRoute';
import AdminDashboard from './Components/AdminDashboard';
import DonorDashboard from './Components/DonorDashboard';
import CreateRequest from './Components/CreateRequest';
import SeekerDashboard from './Components/SeekerDashboard';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/find-blood' element={<FindBlood/>} />
        <Route path='/become-donor' element={<BecomeDonor/>} />
        <Route path="/donor/dashboard" element={<DonorDashboard />} />
        <Route path="/request-blood" element={<CreateRequest />} />

        <Route path='/about' element={<AboutUs/>} />

        <Route
          path='/admin'
          element={
            <AdminRoute>
              <AdminDashboard/>
            </AdminRoute>
          }
        />
        <Route path='/seeker/dashboard' element={<SeekerDashboard/>} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;