import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShipments, saveShipments } from '../utils/localStorage';

function Home() {
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Load shipments when the page opens
  useEffect(() => {
    setShipments(getShipments());
  }, []);

  const handleDelete = (trackingId) => {
    const confirmed = window.confirm('Are you sure you want to delete this shipment?');
    if (!confirmed) return; // If user clicks Cancel, do nothing

    const updated = shipments.filter(s => s.trackingId !== trackingId);
    // .filter() creates a NEW array without the deleted item
    saveShipments(updated);
    setShipments(updated); // Update the screen
  };

  // Filter shipments based on search text
  const filtered = shipments.filter(s =>
    s.trackingId.toLowerCase().includes(search.toLowerCase()) ||
    s.receiverName.toLowerCase().includes(search.toLowerCase()) ||
    s.status.toLowerCase().includes(search.toLowerCase())
    // .includes() checks if the string contains the search text
  );

  const getStatusColor = (status) => {
    if (status === 'Delivered') return 'status-delivered';
    if (status === 'In Transit') return 'status-transit';
    return 'status-booked';
  };

  return (
    <div>
      <div className="home-header">
        <h2>All Shipments ({shipments.length})</h2>
        <button className="btn-primary" onClick={() => navigate('/add')}>+ Add Shipment</button>
      </div>

      <input
        type="text"
        className="search-bar"
        placeholder="Search by Tracking ID, Receiver Name, or Status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className="empty-msg">No shipments found. Add one!</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Pincode</th>
                <th>Weight</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* .map() loops through the array and creates a <tr> for each shipment */}
              {filtered.map((shipment) => (
                <tr key={shipment.trackingId}>
                  {/* key is required by React to track each row uniquely */}
                  <td>{shipment.trackingId}</td>
                  <td>{shipment.senderName}</td>
                  <td>{shipment.receiverName}</td>
                  <td>{shipment.deliveryPincode}</td>
                  <td>{shipment.packageWeight} kg</td>
                  <td>{shipment.shipmentType}</td>
                  <td><span className={`status-badge ${getStatusColor(shipment.status)}`}>{shipment.status}</span></td>
                  <td>{shipment.createdDate}</td>
                  <td>
                    <button className="btn-edit" onClick={() => navigate(`/edit/${shipment.trackingId}`)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(shipment.trackingId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Home;