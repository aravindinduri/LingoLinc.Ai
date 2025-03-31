"use client";
import React from "react";
import { Button, Typography, Box, Container, Grid } from "@mui/material";
import { useSpring, animated } from "react-spring";
import { Card, Flowbite } from "flowbite-react";

export default function LandingPage() {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    delay: 500,
  });

  const scaleUp = useSpring({
    from: { transform: "scale(0.8)" },
    to: { transform: "scale(1)" },
    delay: 800,
  });

  return (
    <Flowbite>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "url(https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          textAlign: "center",
          padding: "2rem",
          color: "white",
          position: "relative",
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: -1,
          }}
        />

        {/* Hero Section */}
        <animated.div style={fadeIn}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "2.5rem", sm: "4rem" },
              letterSpacing: "0.1rem",
              mb: "1.5rem",
              textShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
            }}
          >
            Welcome to Lingolinc
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              maxWidth: "600px",
              marginBottom: "2rem",
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
              textShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            Join us on an incredible journey to explore new opportunities. Let’s
            achieve success together!
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                padding: "0.75rem 2rem",
                borderRadius: "30px",
                fontWeight: "bold",
                fontSize: "1rem",
                backgroundColor: "#1976d2",
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  backgroundColor: "#115293",
                  boxShadow: "0px 12px 20px rgba(0, 0, 0, 0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                padding: "0.75rem 2rem",
                borderRadius: "30px",
                fontWeight: "bold",
                fontSize: "1rem",
                color: "white",
                borderColor: "white",
                "&:hover": {
                  borderColor: "#ccc",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Learn More
            </Button>
          </Box>
        </animated.div>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <animated.div style={fadeIn}>
          <Typography
            variant="h4"
            component="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#333", mb: 4 }}
          >
            Why Choose Us?
          </Typography>
          <Typography
            variant="h6"
            component="p"
            align="center"
            sx={{ mb: 6, maxWidth: "700px", mx: "auto", color: "#555" }}
          >
            We offer the best services to ensure you succeed in your journey.
            Here’s why we stand out:
          </Typography>
        </animated.div>

        {/* Feature Cards */}
        <animated.div style={scaleUp}>
          <Grid container spacing={4} justifyContent="center">
            {[
              { title: "Quality", desc: "Top-notch service and support." },
              { title: "Innovation", desc: "Always evolving and improving." },
              { title: "Support", desc: "24/7 help whenever you need it." },
            ].map((feature, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card className="p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300">
                  <Typography variant="h6" className="font-bold text-lg">
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    component="p"
                    sx={{ color: "#777" }}
                  >
                    {feature.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </animated.div>
      </Container>
    </Flowbite>
  );
}
