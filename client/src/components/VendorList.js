import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "./vendorlist.css";
const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const vendorsPerPage = 5; // Adjust the number of vendors per page as needed

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get("http://localhost:6005/vendors", {
          withCredentials: true,
        });
        setVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  const pageCount = Math.ceil(vendors.length / vendorsPerPage);

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayVendors = vendors
    .slice(pageNumber * vendorsPerPage, (pageNumber + 1) * vendorsPerPage)
    .map((vendor) => (
      <div key={vendor.vendorName} className="vendor-card">
        <h3>{vendor.vendorName}</h3>
        <p>
          <strong>Bank Account No:</strong> {vendor.bankAccountNo}
        </p>
        <p>
          <strong>Bank Name:</strong> {vendor.bankName}
        </p>
        <p>
          <strong>Address Line 1:</strong> {vendor.addressLine1}
        </p>
        <p>
          <strong>Address Line 2:</strong> {vendor.addressLine2}
        </p>
        <p>
          <strong>City:</strong> {vendor.city}
        </p>
        <p>
          <strong>Country:</strong> {vendor.country}
        </p>
        <p>
          <strong>Zip Code:</strong> {vendor.zipCode}
        </p>
        <hr />
      </div>
    ));

  return (
    <div>
      <h2>Vendor List</h2>
      <div className="card-container">{displayVendors}</div>

      <div className="pagination-container">
        <button
          onClick={() => handlePageChange({ selected: pageNumber - 1 })}
          disabled={pageNumber === 0}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange({ selected: pageNumber + 1 })}
          disabled={pageNumber === pageCount - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VendorList;
