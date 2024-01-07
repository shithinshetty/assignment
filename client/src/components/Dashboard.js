import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import UserForm from "./VendorForm";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const fetchUserData = async (page) => {
    try {
      const response = await axios.get(
        `http://localhost:6005/users?page=${page}`,
        {
          withCredentials: true,
        }
      );

      setUserData(response.data);
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchUserData(newPage);
  };

  useEffect(() => {
    fetchUserData(currentPage);
  }, [currentPage]);

  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };
  const handleFormSubmit = (formData) => {
    // Handle the form submission logic here (optional)
    console.log("Handling form submission in Dashboard:", formData);

    // Update the state to indicate that the form has been submitted
    setIsFormSubmitted(true);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Dashboard</h1>

      {showForm ? (
        <div>
          <UserForm
            onFormSubmit={handleFormSubmit}
            isSubmitted={isFormSubmitted}
          />
          <button onClick={toggleForm} disabled={isFormSubmitted}>
            Hide Form
          </button>
        </div>
      ) : (
        <div>
          <h2>Welcome to the Dashboard!</h2>
          <p>Other dashboard content...</p>

          <button onClick={toggleForm} disabled={isFormSubmitted}>
            {isFormSubmitted ? "Form Submitted" : "Show User Form"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
