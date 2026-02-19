// Get all shipments from browser storage
export const getShipments = () => {
  const data = localStorage.getItem('shipments');
  return data ? JSON.parse(data) : [];
  // JSON.parse converts the text stored in localStorage back to a JavaScript array
};

// Save all shipments to browser storage
export const saveShipments = (shipments) => {
  localStorage.setItem('shipments', JSON.stringify(shipments));
  // JSON.stringify converts the array to text so it can be stored
};

// Generate a unique Tracking ID like RST-0001
export const generateTrackingId = () => {
  const shipments = getShipments();
  const number = String(shipments.length + 1).padStart(4, '0');
  // padStart makes sure the number is always 4 digits: 1 → 0001
  return `RST-${number}`;
};