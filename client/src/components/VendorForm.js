// UserForm.jsx

import React, { useState } from "react";
import axios from "axios";

const UserForm = ({ onFormSubmit, isSubmitted }) => {
  const [formData, setFormData] = useState({
    vendorName: "",
    bankAccountNo: "",
    bankName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "",
    zipCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to your server to save the form data
      const response = await axios.post(
        "http://localhost:6005/api/saveUser",
        formData,
        {
          withCredentials: true, // Include credentials if needed
        }
      );

      console.log("Form data submitted:", formData);
      console.log("Server response:", response.data); // Log the server response

      // Invoke the parent component's callback function with the form data
      onFormSubmit(formData);

      // Optional: Reset the form fields after submission
      setFormData({
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
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <h2>User Details Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Vendor Name*:
          <input
            type="text"
            name="vendorName"
            value={formData.vendorName}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Bank Account No*:
          <input
            type="text"
            name="bankAccountNo"
            value={formData.bankAccountNo}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Bank Name*:
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Address Line 1:
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Address Line 2*:
          <input
            type="text"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          City*:
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Country*:
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Zip Code*:
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        {/* Add other form fields as needed */}
        <button type="submit" disabled={isSubmitted}>
          {isSubmitted ? "Submitted" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
