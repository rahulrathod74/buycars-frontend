import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    price: "",
    mileage: "",
    color: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    mileage: "",
    color: "",
    image_url: "",
  });
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const navigate = useNavigate();

  // Fetch cars with filters applied
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(
          "https://buycars-6lbf.onrender.com/api/inventory",
          { params: filters } // Pass filters as query parameters
        );
        setCars(response.data);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      }
    };
    fetchCars();
  }, [filters]);

  // Handle filter select changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // Add a new product
  const addProduct = async () => {
    try {
      await axios.post("https://buycars-6lbf.onrender.com/api/inventory", formData);
      setSuccessMessage("Product added successfully!"); // Show success message
      setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
      setShowModal(false);
      fetchCars();
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  // Edit an existing product
  const editProduct = async () => {
    try {
      await axios.put(
        `https://buycars-6lbf.onrender.com/api/inventory/${selectedCar._id}`,
        formData
      );
      setShowModal(false);
      fetchCars();
    } catch (error) {
      console.error("Failed to edit product:", error);
    }
  };

  // Delete a product
  const deleteProduct = async (carId) => {
    try {
      await axios.delete(`https://buycars-6lbf.onrender.com/api/inventory/${carId}`);
      fetchCars();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  // Handle form submission (add or edit)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      editProduct();
    } else {
      addProduct();
    }
  };

  // Open modal to add a new product
  const openAddModal = () => {
    setFormData({
      title: "",
      price: "",
      mileage: "",
      color: "",
      image_url: "",
    });
    setShowModal(true);
    setEditMode(false);
  };

  // Open modal to edit an existing product
  const openEditModal = (car) => {
    setFormData({
      title: car.title,
      price: car.price,
      mileage: car.mileage,
      color: car.color,
      image_url: car.image_url,
    });
    setSelectedCar(car);
    setShowModal(true);
    setEditMode(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white p-6">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-white tracking-wide">
        Car Inventory
      </h2>

      {/* Logout Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={logout}
          className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 text-center text-green-500 font-bold">
          {successMessage}
        </div>
      )}

      {/* Filter form */}
      <div className="flex justify-center space-x-6 mb-10">
        {/* Price filter */}
        <div className="flex flex-col items-center">
          <label className="text-sm font-semibold mb-2">Max Price</label>
          <select
            name="price"
            value={filters.price}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-700 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          >
            <option value="">Select Max Price</option>
            <option value="10000">Up to $10,000</option>
            <option value="20000">Up to $20,000</option>
            <option value="30000">Up to $30,000</option>
            <option value="40000">Up to $40,000</option>
            <option value="50000">Up to $50,000</option>
          </select>
        </div>
        {/* Mileage filter */}
        <div className="flex flex-col items-center">
          <label className="text-sm font-semibold mb-2">Max Mileage</label>
          <select
            name="mileage"
            value={filters.mileage}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-700 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          >
            <option value="">Select Max Mileage</option>
            <option value="50000">Up to 50,000 miles</option>
            <option value="100000">Up to 100,000 miles</option>
            <option value="150000">Up to 150,000 miles</option>
            <option value="200000">Up to 200,000 miles</option>
          </select>
        </div>
        {/* Color filter */}
        <div className="flex flex-col items-center">
          <label className="text-sm font-semibold mb-2">Select Color</label>
          <select
            name="color"
            value={filters.color}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-700 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          >
            <option value="">Select Color</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="black">Black</option>
            <option value="white">White</option>
            <option value="silver">Silver</option>
            <option value="gray">Gray</option>
            <option value="green">Green</option>
          </select>
        </div>
      </div>

      {/* Add/Edit Product Button */}
      <div className="flex justify-center mb-10">
        <button
          onClick={openAddModal}
          className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add New Product
        </button>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {cars.map((car) => (
          <div
            key={car._id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
          >
            <img
              src={car.image_url}
              alt={car.title}
              className="w-full h-56 object-cover rounded-md mb-4"
            />
            <h3 className="text-2xl font-bold text-white mb-2">{car.title}</h3>
            <div className="flex justify-between mt-2 text-gray-400">
              <p className="text-lg font-medium">Price: ${car.price}</p>
              <p className="text-lg font-medium">
                Mileage: {car.mileage} miles
              </p>
            </div>
            <p className="text-sm mt-2 text-gray-500">Color: {car.color}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => openEditModal(car)}
                className="py-2 px-4 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProduct(car._id)}
                className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding/Editing Product */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="bg-gray-900 p-8 rounded-lg w-96">
            <h3 className="text-2xl font-bold text-white mb-6">
              {editMode ? "Edit Product" : "Add Product"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="text-sm text-white">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="text-sm text-white">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="text-sm text-white">Mileage</label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="text-sm text-white">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="text-sm text-white">Image URL</label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editMode ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
