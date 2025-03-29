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

  return (
    <Flowbite>
      {/* Header Section */}
      <Box className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white text-center p-6">
        <animated.div style={fadeIn}>
          <Typography
            variant="h2"
            className="font-bold text-4xl sm:text-5xl mb-4"
          >
            🚀 Welcome to Lingolinc
          </Typography>
          <Typography
            variant="h5"
            className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300"
          >
            Join us on an incredible journey to explore new opportunities.
            Let’s achieve success together!
          </Typography>
          <Box className="flex flex-wrap justify-center gap-4 mt-6">
            <Button
              variant="contained"
              size="large"
              className="bg-blue-500 hover:bg-blue-700 transition-all duration-300"
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              className="border-white text-white hover:border-gray-300 transition-all duration-300"
            >
              Learn More
            </Button>
          </Box>
        </animated.div>
      </Box>

      {/* Features Section */}
      <Container className="py-12">
        <animated.div style={fadeIn}>
          <Typography
            variant="h4"
            className="text-center font-bold text-gray-800 mb-6"
          >
            Why Choose Us?
          </Typography>
          <Typography
            variant="h6"
            className="text-center text-gray-600 max-w-lg mx-auto mb-10"
          >
            We offer the best services to ensure you succeed. Here’s why we
            stand out:
          </Typography>
        </animated.div>

        <Grid container spacing={4} justifyContent="center">
          {/* Feature Cards */}
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
                <Typography variant="body1" className="text-gray-600 mt-2">
                  {feature.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Flowbite>
  );
}
