import { createContext, useContext, useState, useEffect } from "react";

// 1. Create the context object
const BookingContext = createContext();

// 2. Custom hook to access the context
export const useBooking = () => useContext(BookingContext);

// 3. Default data structure — this is your app's state DNA
const defaultData = {
  searchQuery: {
    from: "",
    to: "",
    tripType: "oneway",
    departureDate: "",
    returnDate: "",
    seatClass: "coach",
    seatCount: 1,
    isTraveling: null,
  },
  selectedFlights: {
    depart: null,
    return: null,
  },
  passengers: [], // [{ name: "", age: "", seat: "" }] or whatever you're collecting
  paymentDetails: {}, // placeholder for future regret
};

export const BookingProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = sessionStorage.getItem("bookingData");
    return saved ? JSON.parse(saved) : defaultData;
  });

  // Save updates to sessionStorage so user reloads don’t cause data loss
  useEffect(() => {
    sessionStorage.setItem("bookingData", JSON.stringify(data));
  }, [data]);

  return (
    <BookingContext.Provider value={{ data, setData }}>
      {children}
    </BookingContext.Provider>
  );
};
