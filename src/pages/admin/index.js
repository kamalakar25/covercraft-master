import { useState, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import AdminDashboard from "./AdminDashboard";
import ProductManagement from "./ProductManagement";
import UserManagement from "./UserManagement";
import PurchaseManagement from "./PurchaseManagement";
import { initializeData } from "../../utils/dataManager";

const AdminPanel = () => {
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    initializeData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="admin panel tabs"
        >
          <Tab label="Dashboard" />
          <Tab label="Products" />
          <Tab label="Users" />
          <Tab label="Purchases" />
        </Tabs>
      </Box>
      {currentTab === 0 && <AdminDashboard />}
      {currentTab === 1 && <ProductManagement />}
      {currentTab === 2 && <UserManagement />}
      {currentTab === 3 && <PurchaseManagement />}
    </Box>
  );
};

export default AdminPanel;
