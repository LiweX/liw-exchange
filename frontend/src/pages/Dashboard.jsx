import Sidebar from "../components/Sidebar";
import { Routes, Route } from "react-router-dom";
import MyCards from "./MyCards";
import ExchangeList from "./ExchangeList";
import Profile from "./Profile";
import CardMarket from "./CardMarket";
import AdminCards from "./AdminCards";

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="cards" element={<MyCards />} />
          <Route path="exchanges" element={<ExchangeList />} />
          <Route path="profile" element={<Profile />} />
          <Route path="available-cards" element={<CardMarket />} />
          <Route path="admin-cards" element={<AdminCards />} />
          <Route path="*" element={<MyCards />} />
        </Routes>
      </div>
    </div>
  );
}