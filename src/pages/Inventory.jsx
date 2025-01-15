import React, { useEffect, useState } from "react";
import axios from "axios";

const Inventory = () => {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    price: "",
    mileage: "",
    color: "",
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("https://buycars-6lbf.onrender.com/api/inventory", { params: filters });
        setCars(response.data);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      }
    };
    fetchCars();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white p-6">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-white tracking-wide">Car Inventory</h2>

      {/* Filter form */}
      <div className="flex justify-center space-x-6 mb-10">
        <div className="flex flex-col items-center">
          <label className="text-sm font-semibold mb-2">Max Price</label>
          <input
            type="number"
            name="price"
            placeholder="Enter Max Price"
            value={filters.price}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-700 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="text-sm font-semibold mb-2">Max Mileage</label>
          <input
            type="number"
            name="mileage"
            placeholder="Enter Max Mileage"
            value={filters.mileage}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-700 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="text-sm font-semibold mb-2">Color</label>
          <input
            type="text"
            name="color"
            placeholder="Enter Color"
            value={filters.color}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-700 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          />
        </div>
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
              <p className="text-lg font-medium">Mileage: {car.mileage} miles</p>
            </div>
            <p className="text-sm mt-2 text-gray-500">Color: {car.color}</p>
            <button className="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-md hover:from-blue-700 hover:to-purple-700 transition duration-300">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
