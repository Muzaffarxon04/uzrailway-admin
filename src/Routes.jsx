import { Route, Routes } from "react-router-dom";
// import Dashboard from "./pages/dashboard/dashboard";
import Partners from "./pages/admins/admins";
import TollTransaction from "./pages/tolltransaction/tolltransaction";
import PartnersAddAction from "./pages/admins/action/addPartner";
import FuelTransactionAddAction from "./pages/fueltransaction/action/addFuelTransaction";
import TollTransactionAddAction from "./pages/tolltransaction/action/addTollTransaction";
import TotalgrossesAddAction from "./pages/totalgrosses/action/addTotalGrosses";
import Login from "./pages/auth/login";
import PrivateRoute from "./utils/PrivateRoute";
import TotalGrosses from "./pages/totalgrosses/totalgrosses";
import FuelTransaction from "./pages/fueltransaction/fueltransaction";
import Reports from "./pages/reports/reports";
import ReportsInner from "./pages/reports/reportsInner";
import Employees from "./pages/employees/employees";
import Flights from "./pages/flights/flights";
import AddEmployee from "./pages/employees/action/addEmployee";
import AddFlight from "./pages/flights/action/addFlight";
import Stations from "./pages/stations/stations";
import AddStation from "./pages/stations/action/addStation";
import FlightDetail from "./pages/flights/detail/flightDetail";
import Devices from "./pages/devices/devices";
import AddDevice from "./pages/devices/action/addDevice";
import FaceLogs from "./pages/facelogs/facelogs";
import FaceLogDetail from "./pages/facelogs/detail/faceLogDetail";
import EmployeeData from "./pages/employeedata/employeedata";

function RoutesComponent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Partners />
          </PrivateRoute>
        }
      />
      <Route
        path="/admins"
        element={
          <PrivateRoute>
            <Partners />
          </PrivateRoute>
        }
      />
      <Route
        path="/admins/:id"
        element={
          <PrivateRoute>
            <PartnersAddAction />
          </PrivateRoute>
        }
      />
     
      <Route
        path="/tolltransaction"
        element={
          <PrivateRoute>
            <TollTransaction />
          </PrivateRoute>
        }
      />
      <Route
        path="/fueltransaction"
        element={
          <PrivateRoute>
            <FuelTransaction />
          </PrivateRoute>
        }
      />
      <Route
        path="/totalgrosses"
        element={
          <PrivateRoute>
            <TotalGrosses />
          </PrivateRoute>
        }
      />
           <Route
        path="/reports"
        element={
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        }
      />
                 <Route
        path="/reports/:reportId"
        element={
          <PrivateRoute>
            <ReportsInner />
          </PrivateRoute>
        }
      />
      
        <Route
        path="/fueltransaction/:id"
        element={
          <PrivateRoute>
            <FuelTransactionAddAction />
          </PrivateRoute>
        }
      />

         <Route
        path="/tolltransaction/:id"
        element={
          <PrivateRoute>
            <TollTransactionAddAction />
          </PrivateRoute>
        }
      />
         <Route
        path="/totalgrosses/:id"
        element={
          <PrivateRoute>
            <TotalgrossesAddAction />
          </PrivateRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <PrivateRoute>
            <Employees />
          </PrivateRoute>
        }
      />
      <Route
        path="/flights"
        element={
          <PrivateRoute>
            <Flights />
          </PrivateRoute>
        }
      />
      <Route
        path="/employees/:id"
        element={
          <PrivateRoute>
            <AddEmployee />
          </PrivateRoute>
        }
      />
      <Route
        path="/flights/detail/:id"
        element={
          <PrivateRoute>
            <FlightDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/flights/:id"
        element={
          <PrivateRoute>
            <AddFlight />
          </PrivateRoute>
        }
      />
      <Route
        path="/stations"
        element={
          <PrivateRoute>
            <Stations />
          </PrivateRoute>
        }
      />
      <Route
        path="/stations/:id"
        element={
          <PrivateRoute>
            <AddStation />
          </PrivateRoute>
        }
      />
      <Route
        path="/devices"
        element={
          <PrivateRoute>
            <Devices />
          </PrivateRoute>
        }
      />
      <Route
        path="/devices/:id"
        element={
          <PrivateRoute>
            <AddDevice />
          </PrivateRoute>
        }
      />
      <Route
        path="/facelogs"
        element={
          <PrivateRoute>
            <FaceLogs />
          </PrivateRoute>
        }
      />
      <Route
        path="/facelogs/detail/:id"
        element={
          <PrivateRoute>
            <FaceLogDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/employeedata"
        element={
          <PrivateRoute>
            <EmployeeData />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
export default RoutesComponent;
