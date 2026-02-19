import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <h2>📦 Shipment Tracker</h2>
      <div>
        {/* Link is like <a> tag but for React Router — it doesn't reload the page */}
        <Link to="/">Home</Link>
        <Link to="/add">Add Shipment</Link>
      </div>
    </nav>
  );
}

export default Navbar;