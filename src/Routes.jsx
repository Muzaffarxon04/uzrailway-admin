import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/login";
import PrivateRoute from "./utils/PrivateRoute";
import Flights from "./pages/flights/flights";
import AddFlight from "./pages/flights/action/addFlight";
import FlightDetail from "./pages/flights/detail/flightDetail";
import TripStatistics from "./pages/flights/statistics/tripStatistics";
import Devices from "./pages/devices/devices";
import AddDevice from "./pages/devices/action/addDevice";
import Trains from "./pages/trains/trains";
import AddTrain from "./pages/trains/action/addTrain";
import TrainDetail from "./pages/trains/detail/trainDetail";
import Attendance from "./pages/attendance/attendance";
import Assignments from "./pages/assignments/assignments";
import Stations from "./pages/stations/stations";
import AddStation from "./pages/stations/action/addStation";
import Regions from "./pages/regions/regions";
import AddRegion from "./pages/regions/action/addRegion";

function RoutesComponent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Flights />
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
        path="/flights/detail/:id"
        element={
          <PrivateRoute>
            <FlightDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/flights/statistics/:id"
        element={
          <PrivateRoute>
            <TripStatistics />
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
        path="/trains"
        element={
          <PrivateRoute>
            <Trains />
          </PrivateRoute>
        }
      />
      <Route
        path="/trains/detail/:id"
        element={
          <PrivateRoute>
            <TrainDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/trains/:id"
        element={
          <PrivateRoute>
            <AddTrain />
          </PrivateRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <PrivateRoute>
            <Attendance />
          </PrivateRoute>
        }
      />
      <Route
        path="/assignments"
        element={
          <PrivateRoute>
            <Assignments />
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
        path="/regions"
        element={
          <PrivateRoute>
            <Regions />
          </PrivateRoute>
        }
      />
      <Route
        path="/regions/:id"
        element={
          <PrivateRoute>
            <AddRegion />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
export default RoutesComponent;
