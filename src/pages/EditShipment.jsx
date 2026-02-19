import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getShipments, saveShipments } from '../utils/localStorage';

function EditShipment() {
  const { id } = useParams(); // Gets the :id from the URL (e.g., RST-0001)
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});

  // useEffect runs code AFTER the component loads on screen
  // The [] means "run this only once, when the page first loads"
  useEffect(() => {
    const shipments = getShipments();
    const shipment = shipments.find(s => s.trackingId === id);
    // .find() searches the array and returns the first item that matches
    if (shipment) {
      setFormData(shipment); // Pre-fill the form with found shipment data
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.senderName.trim()) newErrors.senderName = 'Sender name is required';
    if (!formData.receiverName.trim()) newErrors.receiverName = 'Receiver name is required';
    if (!formData.receiverAddress.trim()) newErrors.receiverAddress = 'Address is required';
    if (!/^\d{6}$/.test(formData.deliveryPincode)) newErrors.deliveryPincode = 'Pincode must be 6 digits';
    if (!formData.packageWeight || formData.packageWeight <= 0) newErrors.packageWeight = 'Weight must be > 0';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const shipments = getShipments();
    // Find the index (position) of the shipment we're editing
    const index = shipments.findIndex(s => s.trackingId === id);
    shipments[index] = formData; // Replace old data with new data
    saveShipments(shipments);

    alert('Shipment updated successfully!');
    navigate('/');
  };

  // While data is loading, show a loading message
  if (!formData) return <p>Loading...</p>;

  return (
    <div className="form-container">
      <h2>Edit Shipment — {id}</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>Sender Name</label>
          <input type="text" name="senderName" value={formData.senderName} onChange={handleChange} />
          {errors.senderName && <span className="error">{errors.senderName}</span>}
        </div>

        <div className="form-group">
          <label>Receiver Name</label>
          <input type="text" name="receiverName" value={formData.receiverName} onChange={handleChange} />
          {errors.receiverName && <span className="error">{errors.receiverName}</span>}
        </div>

        <div className="form-group">
          <label>Receiver Address</label>
          <textarea name="receiverAddress" value={formData.receiverAddress} onChange={handleChange} />
          {errors.receiverAddress && <span className="error">{errors.receiverAddress}</span>}
        </div>

        <div className="form-group">
          <label>Delivery Pincode</label>
          <input type="number" name="deliveryPincode" value={formData.deliveryPincode} onChange={handleChange} />
          {errors.deliveryPincode && <span className="error">{errors.deliveryPincode}</span>}
        </div>

        <div className="form-group">
          <label>Package Weight (kg)</label>
          <input type="number" name="packageWeight" value={formData.packageWeight} onChange={handleChange} step="0.1" />
          {errors.packageWeight && <span className="error">{errors.packageWeight}</span>}
        </div>

        <div className="form-group">
          <label>Shipment Type</label>
          <select name="shipmentType" value={formData.shipmentType} onChange={handleChange}>
            <option value="Express">Express</option>
            <option value="Standard">Standard</option>
            <option value="Economy">Economy</option>
          </select>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Booked">Booked</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        <button type="submit" className="btn-primary">Update Shipment</button>
        <button type="button" className="btn-secondary" onClick={() => navigate('/')}>Cancel</button>
      </form>
    </div>
  );
}

export default EditShipment;