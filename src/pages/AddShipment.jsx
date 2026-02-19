import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShipments, saveShipments, generateTrackingId } from '../utils/localStorage';

function AddShipment() {
  // useState is a React Hook — it creates a variable that, when changed, updates the screen
  // formData holds all the form field values
  const [formData, setFormData] = useState({
    senderName: '',
    receiverName: '',
    receiverAddress: '',
    deliveryPincode: '',
    packageWeight: '',
    shipmentType: 'Standard',
    status: 'Booked',
  });

  // errors holds validation error messages
  const [errors, setErrors] = useState({});
  
  // useNavigate lets us redirect to another page programmatically
  const navigate = useNavigate();

  // This function runs every time the user types in any field
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // ...formData copies all existing values, then [e.target.name] updates only the changed field
    // e.target.name is the "name" attribute of the input that was changed
  };

  // Validate the form before submitting
  const validate = () => {
    const newErrors = {};
    if (!formData.senderName.trim()) newErrors.senderName = 'Sender name is required';
    if (!formData.receiverName.trim()) newErrors.receiverName = 'Receiver name is required';
    if (!formData.receiverAddress.trim()) newErrors.receiverAddress = 'Address is required';
    if (!/^\d{6}$/.test(formData.deliveryPincode)) newErrors.deliveryPincode = 'Pincode must be 6 digits';
    // The /^\d{6}$/ is a "regular expression" — it checks if the value is exactly 6 digits
    if (!formData.packageWeight || formData.packageWeight <= 0) newErrors.packageWeight = 'Weight must be greater than 0';
    return newErrors;
  };

  // This function runs when the form is submitted
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the page from refreshing (default browser behavior)
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Show errors on screen
      return; // Stop here, don't save
    }

    // Create the new shipment object
    const newShipment = {
      ...formData,
      trackingId: generateTrackingId(),
      createdDate: new Date().toLocaleDateString(), // Today's date
    };

    // Get existing shipments, add the new one, save back
    const shipments = getShipments();
    shipments.push(newShipment);
    saveShipments(shipments);

    alert('Shipment created successfully!');
    navigate('/'); // Go back to home page
  };

  return (
    <div className="form-container">
      <h2>Add New Shipment</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>Sender Name</label>
          <input
            type="text"
            name="senderName"
            value={formData.senderName}
            onChange={handleChange}
            placeholder="Enter sender name"
          />
          {/* Only show error message if there is one */}
          {errors.senderName && <span className="error">{errors.senderName}</span>}
        </div>

        <div className="form-group">
          <label>Receiver Name</label>
          <input
            type="text"
            name="receiverName"
            value={formData.receiverName}
            onChange={handleChange}
            placeholder="Enter receiver name"
          />
          {errors.receiverName && <span className="error">{errors.receiverName}</span>}
        </div>

        <div className="form-group">
          <label>Receiver Address</label>
          <textarea
            name="receiverAddress"
            value={formData.receiverAddress}
            onChange={handleChange}
            placeholder="Enter full address"
          />
          {errors.receiverAddress && <span className="error">{errors.receiverAddress}</span>}
        </div>

        <div className="form-group">
          <label>Delivery Pincode</label>
          <input
            type="number"
            name="deliveryPincode"
            value={formData.deliveryPincode}
            onChange={handleChange}
            placeholder="6-digit pincode"
          />
          {errors.deliveryPincode && <span className="error">{errors.deliveryPincode}</span>}
        </div>

        <div className="form-group">
          <label>Package Weight (kg)</label>
          <input
            type="number"
            name="packageWeight"
            value={formData.packageWeight}
            onChange={handleChange}
            placeholder="Weight in kg"
            step="0.1"
          />
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

        <button type="submit" className="btn-primary">Create Shipment</button>
      </form>
    </div>
  );
}

export default AddShipment;