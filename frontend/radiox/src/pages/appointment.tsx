import React, { useState } from "react";
import Navbar from "../components/Home/NavBar/Navbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import AppointCalendar from '../components/Appointment/AppointCalendar/appointCalendar';

function Appointment() {
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);
  const navigate = useNavigate();

  const handleBackToProfile = () => {
    navigate('/patient');
  };

  return (
    <div className="appointment">
      <Navbar />
      <Container style={{ marginTop: "2rem" }}>
        <Box
          sx={{
            marginBottom: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1>Schedule Appointment</h1>
        </Box>
        <AppointCalendar
          onTimeslotSelect={(slot: any) => setSelectedTimeslot(slot)}
        />
        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            disabled={!selectedTimeslot}
            onClick={() => {
              navigate("/checkout", {
                state: { selectedTimeslot },
              });
            }}
          >
            Continue to Checkout
          </Button>
        </Box>
      </Container>
    </div>
  );
}

export default Appointment;