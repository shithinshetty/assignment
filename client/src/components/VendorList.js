import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "./vendorlist.css";

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const vendorsPerPage = 5;

  const [editingVendor, setEditingVendor] = useState(null);
  const [editedVendor, setEditedVendor] = useState({
    vendorName: "",
    bankAccountNo: "",
    bankName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "",
    zipCode: "",
  });

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

  const handleEditClick = (vendor) => {
    console.log("Vendor ID being set:", vendor._id);
    console.log("Vendor object:", vendor);

    setEditingVendor(vendor);

    setEditedVendor({
      vendorId: vendor._id,
      bankAccountNo: vendor.bankAccountNo,
      bankName: vendor.bankName,
      addressLine1: vendor.addressLine1,
      addressLine2: vendor.addressLine2,
      city: vendor.city,
      country: vendor.country,
      zipCode: vendor.zipCode,
    });
  };

  const handleSubmit = async (vendor) => {
    console.log("Submitting Vendor ID:", editingVendor._id);
    console.log("Edited Vendor Data:", editedVendor);

    try {
      const updatedData = {
        vendorName: editedVendor.vendorName,
        bankAccountNo: editedVendor.bankAccountNo,
        bankName: editedVendor.bankName,
        addressLine1: editedVendor.addressLine1,
        addressLine2: editedVendor.addressLine2,
        city: editedVendor.city,
        country: editedVendor.country,
        zipCode: editedVendor.zipCode,
      };

      const response = await axios.put(
        `http://localhost:6005/editvendor/${editingVendor._id}`,
        updatedData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Response from server:", response);

      const updatedVendor = response.data.updatedVendor;

      const updatedVendors = vendors.map((vendor) =>
        vendor.vendorId === editingVendor.vendorId ? updatedVendor : vendor
      );

      setVendors(updatedVendors);

      // Reset the editing state
      setEditingVendor(null);
      setEditedVendor({});
    } catch (error) {
      console.error("Error updating vendor:", error);
      if (error.response) {
        console.error(
          "Server responded with error status:",
          error.response.status
        );
        console.error("Error response data:", error.response.data);
      } else if (error.request) {
        console.error("No response received from the server");
      } else {
        console.error("Error during request setup:", error.message);
      }
    }
  };

  //delete function
  const handleDeleteClick = (vendor) => {
    // Display a confirmation dialog
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${vendor.vendorName}?`
    );

    if (isConfirmed) {
      // User confirmed, proceed with the delete operation
      performDeleteOperation(vendor);
    } else {
      // User canceled, do nothing
      console.log("Delete canceled by user");
    }
  };

  const performDeleteOperation = async (vendor) => {
    try {
      // Send a delete request to the server
      const response = await axios.delete(
        `http://localhost:6005/deletevendor/${vendor._id}`
      );

      console.log("Response from server:", response);

      // Filter out the deleted vendor from the state
      const updatedVendors = vendors.filter(
        (existingVendor) => existingVendor._id !== vendor._id
      );

      // Update the state
      setVendors(updatedVendors);
    } catch (error) {
      console.error("Error deleting vendor:", error);
      // Handle errors if necessary
    }
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

        <button onClick={() => handleEditClick(vendor)}>Edit</button>

        <button onClick={() => handleDeleteClick(vendor)}>Delete</button>
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
      {editingVendor && (
        <div>
          <h3>Edit Vendor</h3>
          <label>
            Vendor Name:
            <input
              type="text"
              value={editedVendor.vendorName || ""}
              onChange={(e) =>
                setEditedVendor({ ...editedVendor, vendorName: e.target.value })
              }
            />
          </label>
          <label>
            Vendor BankAccount No.:
            <input
              type="text"
              value={editedVendor.bankAccountNo || ""}
              onChange={(e) =>
                setEditedVendor({
                  ...editedVendor,
                  bankAccountNo: e.target.value,
                })
              }
            />
          </label>
          <label>
            Vendor BankName:
            <input
              type="text"
              value={editedVendor.bankName || ""}
              onChange={(e) =>
                setEditedVendor({ ...editedVendor, bankName: e.target.value })
              }
            />
          </label>
          <label>
            addressLine1:
            <input
              type="text"
              value={editedVendor.addressLine1 || ""}
              onChange={(e) =>
                setEditedVendor({
                  ...editedVendor,
                  addressLine1: e.target.value,
                })
              }
            />
          </label>
          <label>
            addressLine2:
            <input
              type="text"
              value={editedVendor.addressLine2 || ""}
              onChange={(e) =>
                setEditedVendor({
                  ...editedVendor,
                  addressLine2: e.target.value,
                })
              }
            />
          </label>
          <label>
            city
            <input
              type="text"
              value={editedVendor.city || ""}
              onChange={(e) =>
                setEditedVendor({
                  ...editedVendor,
                  city: e.target.value,
                })
              }
            />
          </label>
          <label>
            country
            <input
              type="text"
              value={editedVendor.country || ""}
              onChange={(e) =>
                setEditedVendor({
                  ...editedVendor,
                  country: e.target.value,
                })
              }
            />
          </label>
          <label>
            zipCode
            <input
              type="text"
              value={editedVendor.zipCode || ""}
              onChange={(e) =>
                setEditedVendor({
                  ...editedVendor,
                  zipCode: e.target.value,
                })
              }
            />
          </label>
          <button onClick={handleSubmit}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default VendorList;
