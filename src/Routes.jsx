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
    </Routes>
  );
}
export default RoutesComponent;
