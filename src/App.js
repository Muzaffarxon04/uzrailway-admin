import { BrowserRouter } from "react-router-dom";
// import { useEffect, useState } from "react";
import "./App.scss";
import { ConfigProvider } from "antd";
import RoutesComponent from "./Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import Login from "./pages/auth/login";
// import axios from "axios";
// import { BASE_URL } from "./consts/variables";
import { NotificationProvider } from "./components/notification";
import { LocalizationProvider } from "./LocalizationContext";

const queryClient = new QueryClient();

const theme = {
  token: {
    colorPrimary: "#1890ff",
    colorText: "#131314",
    borderRadius: 16,
  },
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LocalizationProvider>
          <ConfigProvider theme={theme}>
            <NotificationProvider>
              <RoutesComponent />
            </NotificationProvider>
          </ConfigProvider>
        </LocalizationProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
