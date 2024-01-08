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
    console.log("Vendor ID being set:", vendor.vendorId);
    console.log("Vendor object:", vendor);
    setEditingVendor(vendor);
    setEditedVendor({
      vendorName: vendor.vendorName,
      bankAccountNo: vendor.bankAccountNo,
      bankName: vendor.bankName,
    });
  };

  const handleSubmit = async () => {
    console.log("Submitting Vendor ID:", editingVendor.vendorId);
    console.log("Edited Vendor Data:", editedVendor);
    try {
      await axios.put(
        `http://localhost:6005/editvendor/${editingVendor.vendorId}`,
        editedVendor
      );

      const updatedVendors = vendors.map((vendor) =>
        vendor.vendorId === editingVendor.vendorId
          ? { ...vendor, ...editedVendor }
          : vendor
      );

      setVendors(updatedVendors);

      // Reset the editing state
      setEditingVendor(null);
      setEditedVendor({});
    } catch (error) {
      console.error("Error updating vendor:", error);
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
        {/* Ensure vendorId is available and passed correctly */}
        <button onClick={() => handleEditClick(vendor)}>Edit</button>
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
          <button onClick={handleSubmit}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default VendorList;
