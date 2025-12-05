// import { Navigate } from "react-router-dom";
// import LayoutComponent from "../components/layout/index";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { BASE_URL } from "../consts/variables";

// const PrivateRoute = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(null); // `null` to prevent early redirects

//   useEffect(() => {
//     const checkAuth = async () => {
//       const accessToken = localStorage.getItem("access_token");
//       const refreshToken = localStorage.getItem("refresh_token");
//       console.log(accessToken, "accessToken", refreshToken, "refreshToken");

//       if (accessToken) {
//         try {
//           // Decode token payload
//           const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
//           const expiryTime = tokenPayload.exp * 1000;

//           if (Date.now() < expiryTime) {
//             setIsAuthenticated(true);
//             return;
//           }
//         } catch (error) {
//           console.error("Invalid token format:", error);
//           localStorage.removeItem("access_token");
//         }
//       }

//       // If access token is expired, attempt to refresh it
//       if (refreshToken) {
//         try {
//           const response = await axios.post(`${BASE_URL}admin/refresh-token`, {
//             refresh_token: refreshToken,
//           });
//           console.log(response, "response");
//           localStorage.setItem("access_token", response.data.access_token);
//           setIsAuthenticated(true);
//           return;
//         } catch (error) {
//           console.error("Refresh token failed:", error);
//           localStorage.removeItem("access_token");
//           localStorage.removeItem("refresh_token");
//         }
//       }

//       setIsAuthenticated(false); // Only set false if refresh failed
//     };

//     checkAuth();
//   }, []);

//   if (isAuthenticated === null) return null; // Prevent early redirection

//   return isAuthenticated ? (
//     <LayoutComponent>{children}</LayoutComponent>
//   ) : (
//     <Navigate to="/login" replace />
//   );
// };

// export default PrivateRoute;

import { Navigate } from "react-router-dom";
import LayoutComponent from "../components/layout/index";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    setIsAuthenticated(!!accessToken); // true if token exists, false otherwise
  }, []);

  if (isAuthenticated === null) {
    return null; // Or return a spinner/loader
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <LayoutComponent>{children}</LayoutComponent>;
};

export default PrivateRoute;
