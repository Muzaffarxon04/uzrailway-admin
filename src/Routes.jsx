import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/login";
import PrivateRoute from "./utils/PrivateRoute";
import Flights from "./pages/flights/flights";
import AddFlight from "./pages/flights/action/addFlight";
import FlightDetail from "./pages/flights/detail/flightDetail";
import TripStatistics from "./pages/flights/statistics/tripStatistics";
import Devices from "./pages/devices/devices";
import AddDevice from "./pages/devices/action/addDevice";
import HikiList from "./pages/devices/hikiList";
import Trains from "./pages/trains/trains";
import AddTrain from "./pages/trains/action/addTrain";
import TrainDetail from "./pages/trains/detail/trainDetail";
import Attendance from "./pages/attendance/attendance";
import Assignments from "./pages/assignments/assignments";
import AddAssignment from "./pages/assignments/action/addAssignment";
import AssignmentDetail from "./pages/assignments/detail/assignmentDetail";
import Stations from "./pages/stations/stations";
import AddStation from "./pages/stations/action/addStation";
import Regions from "./pages/regions/regions";
import AddRegion from "./pages/regions/action/addRegion";
import Employees from "./pages/employees/employees";
import AddEmployee from "./pages/employees/action/addEmployee";
import EmployeeDetail from "./pages/employees/detail/employeeDetail";
import AttendanceDetail from "./pages/attendance/detail/attendanceDetail";
import AttendanceStatistics from "./pages/attendance/statistics/attendanceStatistics";
import EventsLogs from "./pages/eventsLogs/eventsLogs";
import Departments from "./pages/departments/departments";
import AddDepartment from "./pages/departments/action/addDepartment";
import Positions from "./pages/positions/positions";
import AddPosition from "./pages/positions/action/addPosition";

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
        path="/devices/hiki-list"
        element={
          <PrivateRoute>
            <HikiList />
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
        path="/events-logs"
        element={
          <PrivateRoute>
            <EventsLogs />
          </PrivateRoute>
        }
      />
      <Route
        path="/attendance/detail/:id"
        element={
          <PrivateRoute>
            <AttendanceDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/attendance/statistics"
        element={
          <PrivateRoute>
            <AttendanceStatistics />
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
        path="/assignments/:id"
        element={
          <PrivateRoute>
            <AddAssignment />
          </PrivateRoute>
        }
      />
      <Route
        path="/assignments/detail/:id"
        element={
          <PrivateRoute>
            <AssignmentDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/assignments/add"
        element={
          <PrivateRoute>
            <AddAssignment />
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
      <Route
        path="/employees"
        element={
          <PrivateRoute>
            <Employees />
          </PrivateRoute>
        }
      />
      <Route
        path="/employees/detail/:id"
        element={
          <PrivateRoute>
            <EmployeeDetail />
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
        path="/departments"
        element={
          <PrivateRoute>
            <Departments />
          </PrivateRoute>
        }
      />
      <Route
        path="/departments/:id"
        element={
          <PrivateRoute>
            <AddDepartment />
          </PrivateRoute>
        }
      />
      <Route
        path="/positions"
        element={
          <PrivateRoute>
            <Positions />
          </PrivateRoute>
        }
      />
      <Route
        path="/positions/:id"
        element={
          <PrivateRoute>
            <AddPosition />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
export default RoutesComponent;
