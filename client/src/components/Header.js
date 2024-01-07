import React, { useEffect, useState } from "react";
import "./header.css";
import { NavLink } from "react-router-dom";
import axios from "axios";

const Headers = () => {
  const [userdata, setUserdata] = useState({});
  console.log("response", userdata);

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:6005/login/sucess", {
        withCredentials: true,
      });

      setUserdata(response.data.user);
    } catch (error) {
      console.log("error", error);
    }
  };

  // logoout
  const logout = () => {
    window.open("http://localhost:6005/logout", "_self");
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <>
      <header>
        <nav>
          <div className="left">
            <h1>Vendor Management App</h1>
          </div>
          <div className="right">
            <ul>
              {Object?.keys(userdata)?.length > 0 ? (
                <>
                  <li
                    style={{
                      marginRight: "10px",
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    {userdata?.displayName}
                  </li>
                  <li style={{ marginRight: "10px" }}>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                  </li>
                  <li style={{ marginRight: "10px" }} onClick={logout}>
                    Logout
                  </li>
                  <li style={{ marginRight: "10px" }}>
                    <NavLink to="/vendors">VendorList</NavLink>
                  </li>
                  <li>
                    <img
                      src={userdata?.image}
                      style={{
                        width: "50px",
                        borderRadius: "50%",
                        marginLeft: "10px",
                      }}
                      alt=""
                    />
                  </li>
                </>
              ) : (
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Headers;
