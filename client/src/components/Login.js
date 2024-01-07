import React from "react";
import "./login.css";

const Login = () => {
  const loginwithgoogle = () => {
    window.open("http://localhost:6005/auth/google/callback", "_self");
  };
  return (
    <>
      <div className="login-page">
        <h1 style={{ textAlign: "center" }}>Login</h1>
        <div className="form">
          <button className="login-with-google-btn" onClick={loginwithgoogle}>
            Sign In With Google
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
