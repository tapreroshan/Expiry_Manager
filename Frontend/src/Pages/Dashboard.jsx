import { useState, useEffect } from 'react';
import { format, differenceInDays } from 'date-fns';
import axios from 'axios';

const Dashboard = () => {
  const [medicines, setMedicines] = useState([]);
  const [isAddingMedicine, setIsAddingMedicine] = useState(false);
  const [isEditingMedicine, setIsEditingMedicine] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    expiry_date: '',
    batch_number: '',
    quantity: 1,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterExpiringSoon, setFilterExpiringSoon] = useState(false);
  const [userName, setUserName] = useState(''); // State for user's name

  // Fetch medicines and user data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login'; // Redirect if no token
          return;
        }

        // Fetch medicines
        const medicinesResponse = await axios.get('http://localhost:5000/product/medicines', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        setMedicines(medicinesResponse.data);

        // Fetch user data
        const userResponse = await axios.get('http://localhost:5000/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserName(userResponse.data.name); // Set user's name
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token'); // Clear invalid token
          window.location.href = '/login'; // Redirect to login
        } else {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, []);

  // Add Medicine
  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Access Denied. No token provided");
        return;
      }
      const response = await axios.post('http://localhost:5000/product/add', 
        {
          name: newMedicine.name,
          expiry_date: new Date(newMedicine.expiry_date),
          batch_number: newMedicine.batch_number ? Number(newMedicine.batch_number) : undefined,
          quantity: newMedicine.quantity,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setMedicines([...medicines, response.data]);
      setIsAddingMedicine(false);
      setNewMedicine({
        name: '',
        expiry_date: '',
        batch_number: '',
        quantity: 1,
      });
    } catch (error) {
      console.log("Access Denied. No token provided", error);
    }
  };

  // Delete Medicine
  const handleDeleteMedicine = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/product/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMedicines(medicines.filter(medicine => medicine._id !== id));
    } catch (error) {
      console.error('Error deleting medicine:', error);
    }
  };

  // Edit Medicine
  const handleEditMedicine = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/product/update/${editingMedicine._id}`, 
        {
          name: editingMedicine.name,
          expiry_date: new Date(editingMedicine.expiry_date),
          batch_number: editingMedicine.batch_number ? Number(editingMedicine.batch_number) : undefined,
          quantity: editingMedicine.quantity,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setMedicines(medicines.map(medicine => 
        medicine._id === editingMedicine._id ? response.data : medicine
      ));
      setIsEditingMedicine(false);
      setEditingMedicine(null);
    } catch (error) {
      console.error('Error editing medicine:', error);
    }
  };

  // Get Card Color Based on Expiry Date
  const getCardColor = (expiryDate) => {
    const daysUntilExpiry = differenceInDays(new Date(expiryDate), new Date());
    if (daysUntilExpiry <= 7) return 'bg-red-50 border-red-200';
    if (daysUntilExpiry <= 30) return 'bg-orange-50 border-orange-200';
    return 'bg-white border-gray-200';
  };

  // Filter and Sort Medicines
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isExpiringSoon = filterExpiringSoon ? differenceInDays(new Date(medicine.expiry_date), new Date()) <= 30 : true;
    return matchesSearch && isExpiringSoon;
  });

  const sortedMedicines = [...filteredMedicines].sort((a, b) => {
    return differenceInDays(new Date(a.expiry_date), new Date(b.expiry_date));
  });

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between h-16 sm:h-auto py-2 sm:py-0">
            {/* Logo */}
            <div className="flex items-center justify-center sm:justify-start">
              <h1 className="text-xl font-semibold text-gray-900">Medicine Tracker</h1>
            </div>
  
            {/* Search, Filters, and Buttons */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-0">
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
  
              {/* Expiring Soon Filter */}
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filterExpiringSoon}
                  onChange={(e) => setFilterExpiringSoon(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Show Expiring Soon</span>
              </label>
  
              {/* Add Medicine Button */}
              <button
                onClick={() => setIsAddingMedicine(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Medicine
              </button>
  
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
  
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Add Medicine Form */}
        {isAddingMedicine && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-medium mb-4">Add New Medicine</h2>
              <form onSubmit={handleAddMedicine} className="space-y-4">
                {/* Medicine Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Medicine Name
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full px-4 py-2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={newMedicine.name}
                    onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                  />
                </div>
  
                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    className="mt-1 block w-full px-4 py-2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={newMedicine.expiry_date}
                    onChange={(e) => setNewMedicine({ ...newMedicine, expiry_date: e.target.value })}
                  />
                </div>
  
                {/* Batch Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-4 py-2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={newMedicine.batch_number}
                    onChange={(e) => setNewMedicine({ ...newMedicine, batch_number: e.target.value })}
                  />
                </div>
  
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="mt-1 block w-full px-4 py-2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={newMedicine.quantity}
                    onChange={(e) => setNewMedicine({ ...newMedicine, quantity: parseInt(e.target.value) })}
                  />
                </div>
  
                {/* Form Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingMedicine(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
  
        {/* Edit Medicine Form */}
        {isEditingMedicine && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-medium mb-4">Edit Medicine</h2>
              <form onSubmit={handleEditMedicine} className="space-y-4">
                {/* Medicine Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Medicine Name
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full px-4 py-2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={editingMedicine.name}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, name: e.target.value })}
                  />
                </div>
  
                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    className="mt-1 block w-full px-4 py-2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={editingMedicine.expiry_date}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, expiry_date: e.target.value })}
                  />
                </div>
  
                {/* Batch Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-4 py-2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={editingMedicine.batch_number}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, batch_number: e.target.value })}
                  />
                </div>
  
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="mt-1 block w-full px-4 py-2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={editingMedicine.quantity}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, quantity: parseInt(e.target.value) })}
                  />
                </div>
  
                {/* Form Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingMedicine(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
  
        {/* Medicine Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedMedicines.map((medicine) => (
            <div
              key={medicine._id}
              className={`${getCardColor(
                medicine.expiry_date
              )} border rounded-lg shadow-sm p-4 transition-all duration-200 hover:shadow-md`}
            >
              <h3 className="text-lg font-medium text-gray-900">{medicine.name}</h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>Expires: {format(new Date(medicine.expiry_date), 'MMMM dd, yyyy')}</p>
                {medicine.batch_number && <p>Batch: {medicine.batch_number}</p>}
                <p>Quantity: {medicine.quantity}</p>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => {
                    setEditingMedicine(medicine);
                    setIsEditingMedicine(true);
                  }}
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteMedicine(medicine._id)}
                  className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;