import React, { useState } from "react";
import styles from "./Dash.module.css";
import { useNavigate } from "react-router-dom";
import car1 from "../../assets/car1.jpeg";
import car2 from "../../assets/car2.jpeg";
import car3 from "../../assets/car3.jpeg";
import { Box, Flex } from "@chakra-ui/react";
// Import local demo images
const cars = [
  {
    id: 1,
    name: "Toyota Camry",
    category: "Sedan",
    image: car1,
    kmDay: "AED 100 / Day",
    kmDayLimit: "22 KM / Day",
    kmWeek: "AED 600 / Week",
    kmWeekLimit: "150 KM / Week",
    kmMonth: "AED 1800 / Month",
    kmMonthLimit: "600 KM / Month",
    status: "pending",
  },
  {
    id: 2,
    name: "Nissan Patrol",
    category: "SUV",
    image: car2,
    kmDay: "AED 150 / Day",
    kmDayLimit: "30 KM / Day",
    kmWeek: "AED 900 / Week",
    kmWeekLimit: "200 KM / Week",
    kmMonth: "AED 2500 / Month",
    kmMonthLimit: "800 KM / Month",
    status: "approved",
  },
  {
    id: 3,
    name: "BMW X5",
    category: "Luxury",
    image: car3,
    kmDay: "AED 300 / Day",
    kmDayLimit: "50 KM / Day",
    kmWeek: "AED 1800 / Week",
    kmWeekLimit: "300 KM / Week",
    kmMonth: "AED 5000 / Month",
    kmMonthLimit: "1000 KM / Month",
    status: "hold",
  },
];

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      {/* Cards */}
      <Box display={{ base: "block", md: "flex" }} className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>🚗</div>
          <div>
            <p>Pending</p>
            <h3>{cars.filter((c) => c.status === "pending").length}</h3>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}>✅</div>
          <div>
            <p>Approved</p>
            <h3>{cars.filter((c) => c.status === "approved").length}</h3>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}>⏸</div>
          <div>
            <p>Hold</p>
            <h3>{cars.filter((c) => c.status === "hold").length}</h3>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default DashboardPage;
