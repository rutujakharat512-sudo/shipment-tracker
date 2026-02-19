import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddShipment from './pages/AddShipment';
import EditShipment from './pages/EditShipment';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      {/* BrowserRouter enables routing in your app */}
      <Navbar />
      <div className="container">
        <Routes>
          {/* Routes looks at the URL and shows the matching component */}
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddShipment />} />
          <Route path="/edit/:id" element={<EditShipment />} />
          {/* :id is a variable — it will hold the tracking ID of the shipment to edit */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;