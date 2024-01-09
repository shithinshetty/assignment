import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState({
    vendorName: "",
    bankAccountNo: "",
    bankName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "",
    zipCode: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:6005/dashboard", vendorData, {
        withCredentials: true,
      });

      // Update the submission status
      setSubmissionStatus("Form submitted successfully!");

      // Optionally, you can reset the form data
      setVendorData({
        vendorName: "",
        bankAccountNo: "",
        bankName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        country: "",
        zipCode: "",
      });
    } catch (error) {
      console.error("Error submitting vendor details:", error);

      // Update the submission status for error case
      setSubmissionStatus("Error submitting the form. Please try again.");
    }
  };

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:6005/login/success", {
        withCredentials: true,
      });

      console.log("response", response);
    } catch (error) {
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    getUser();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="vendorName">Vendor Name:</label>
          <input
            type="text"
            name="vendorName"
            value={vendorData.vendorName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="bankAccountNo">Bank Account No:</label>
          <input
            type="text"
            name="bankAccountNo"
            value={vendorData.bankAccountNo}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="bankName">Bank Name:</label>
          <input
            type="text"
            name="bankName"
            value={vendorData.bankName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="addressLine1">Address Line 1:</label>
          <input
            type="text"
            name="addressLine1"
            value={vendorData.addressLine1}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="addressLine2">Address Line 2:</label>
          <input
            type="text"
            name="addressLine2"
            value={vendorData.addressLine2}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="city">City:</label>
          <input
            type="text"
            name="city"
            value={vendorData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            name="country"
            value={vendorData.country}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="zipCode">Zip Code:</label>
          <input
            type="text"
            name="zipCode"
            value={vendorData.zipCode}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>

      {submissionStatus && <p>{submissionStatus}</p>}
    </div>
  );
};

export default Dashboard;
