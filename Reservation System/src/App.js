import React, { useState } from "react";
import { PiOfficeChairLight } from "react-icons/pi";
import toast, { Toaster } from "react-hot-toast";
import "./App.css"; // Add custom styles for visualizing seats

const TOTAL_SEATS = 80; // Total number of seats in the coach
const ROW_SIZE = 7; // Number of seats in a row
const LAST_ROW_SIZE = 3; // Last row with 3 seats

// Helper function to initialize the seat map
const initializeSeats = () => Array(TOTAL_SEATS).fill(false); // false means the seat is available

const App = () => {
  const [seats, setSeats] = useState(initializeSeats());
  const [numSeats, setNumSeats] = useState("");
  const [isFull, setIsFull] = useState(false);

  // Function to calculate available seats for booking in one row
  const findAvailableRowSeats = (updatedSeats, numSeats) => {
    for (let row = 0; row < Math.ceil(updatedSeats.length / ROW_SIZE); row++) {
      const start = row * ROW_SIZE;
      const end = row === Math.ceil(updatedSeats.length / ROW_SIZE) - 1 ? start + LAST_ROW_SIZE : start + ROW_SIZE;

      let count = 0;
      for (let i = start; i < end; i++) {
        if (!updatedSeats[i]) {
          count++;
          if (count === numSeats) {
            return { start, end, index: i };
          }
        } else {
          count = 0;
        }
      }
    }
    return null;
  };

  // Function to find nearby available seats if not enough in one row
  const findNearbySeats = (updatedSeats, numSeats) => {
    const bookedSeats = [];
    for (let i = 0; i < updatedSeats.length && bookedSeats.length < numSeats; i++) {
      if (!updatedSeats[i]) {
        updatedSeats[i] = true;
        bookedSeats.push(i + 1);
      }
    }
    return bookedSeats.length === numSeats ? bookedSeats : null;
  };

  // Function to handle booking
  const bookSeats = () => {
    const validNumSeats = parseInt(numSeats);
    if (isNaN(validNumSeats) || validNumSeats < 1 || validNumSeats > 7) {
      toast.error("You can book between 1 and 7 seats at a time.");
      return;
    }

    if (isFull) {
      toast.error("All seats are already booked.");
      return;
    }

    const updatedSeats = [...seats];
    let bookedSeats = [];

    // Try to find available seats in one row first
    const availableRowSeats = findAvailableRowSeats(updatedSeats, validNumSeats);

    if (availableRowSeats) {
      // Book seats in the found row
      const { start, index } = availableRowSeats;
      for (let i = index + 1 - validNumSeats; i <= index; i++) {
        updatedSeats[i] = true;
      }
      bookedSeats = Array.from({ length: validNumSeats }, (_, i) => start + index + 1 - validNumSeats + 1 + i);
    } else {
      // If not enough seats in one row, book nearby seats
      bookedSeats = findNearbySeats(updatedSeats, validNumSeats);
    }

    if (bookedSeats) {
      setSeats(updatedSeats);
      setIsFull(updatedSeats.every(seat => seat)); // Check if all seats are booked
      toast.success(`Seats booked: ${bookedSeats.join(", ")}`);
    } else {
      toast.error("Not enough seats available.");
    }
  };

  // Function to reset all bookings
  const resetBookings = () => {
    setSeats(initializeSeats());
    setIsFull(false);
    toast.success("All bookings have been reset.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-200">
      <Toaster />
      <div className=" flex justify-center items-center">
      <div className="bg-white text-3xl border-2 p-6 border-black rounded-md font-bold mb-4 mt-4 text-center text-blue-700">Train Seat Reservation System</div>
      </div>
      <div className="flex flex-col lg:flex-row justify-center items-start gap-8 lg:gap-10 ">
        {/* Reservation Chart Box (Left Side) */}
        <div className="bg-white  p-4 pl-16 border-2 shadow-md rounded-lg w-full lg:w-[40%]">
          <div className="text-center font-bold text-3xl text-orange-500 p-2">Reservation Chart</div>
          <div className="grid grid-cols-5 gap-1 p-auto m-auto">
            {seats.map((seat, index) => (
              <div
              key={index}
              className={`relative shadow-lg w-16 h-16 flex flex-col items-center justify-center  rounded-lg text-sm font-semibold ${
                seat ? "bg-green-400 text-white" : "bg-blue-300 text-black"
              }`}
              title={seat ? "Booked" : "Available"}
            >
              {/* Seat number displayed at the top */}
              <div className="absolute top-1 text-xs font-bold">
                {index + 1}
              </div>
              {/* Seat icon displayed below the number */}
              <div className="mt-4">
                <PiOfficeChairLight size={40} />
              </div>
            </div>
            ))}
          </div>
        </div>

        {/* Booking Input Fields Box (Right Side) */}
        <div className="bg-white p-4 shadow-xl border-2  rounded-lg w-full lg:w-[30%] bg-yellow-300 ">
          <div className="flex  justify-items-center text-black font-bold">Enter Details:</div>
          <div className="flex  items-center gap-6">
            <input
              type="number"
              id="numSeats"
              value={numSeats}
              onChange={(e) => setNumSeats(e.target.value)}
              placeholder="Enter number of seats"
              min="1"
              max="7"
              className="border border-gray-300 p-2 rounded-md w-80 text-center  bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-4">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 shadow-md transition-transform transform hover:scale-105"
                onClick={bookSeats}
              >
                Book Seats
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 shadow-md transition-transform transform hover:scale-105"
                onClick={resetBookings}
              >
                Reset Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
