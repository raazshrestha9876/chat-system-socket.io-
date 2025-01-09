import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPages from "./pages/AuthPages";
import HomePages from "./pages/HomePages";
import ChatPages from "./pages/ChatPages";

const App: React.FC = () => {
  const token = localStorage.getItem("token");
  console.log(token);
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPages />} />
        <Route path="/" element={<HomePages />} />
        <Route path="/chat" element={token ? <ChatPages />: <Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
};
export default App;
