"use client"
import React from 'react';
import { Button, Typography, Box, Container, Grid } from '@mui/material';
import { useSpring, animated } from 'react-spring';

export default function LandingPage() {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 500,
  });

  const scaleUp = useSpring({
    from: { transform: 'scale(0.8)' },
    to: { transform: 'scale(1)' },
    delay: 800,
  });

  return (
    <Box>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'url(https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          textAlign: 'center',
          padding: '2rem',
          color: 'white',
          backdropFilter: 'blur(10px)',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: -1,
          }}
        />
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2.5rem', sm: '4rem' },
            letterSpacing: '0.1rem',
            mb: '1.5rem',
            textShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
          }}
        >
          Welcome to Lingolinc
        </Typography>
        <Typography
          variant="h5"
          component="p"
          sx={{
            maxWidth: '600px',
            marginBottom: '2rem',
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            textShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          Join us on an incredible journey to explore new opportunities. Let&apos;s achieve success together!
        </Typography>
        <Box sx={{ display: 'flex', gap: '1rem', flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              padding: '0.75rem 2rem',
              borderRadius: '30px',
              fontWeight: 'bold',
              fontSize: '1rem',
              backgroundColor: '#1976d2',
              boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
              '&:hover': { backgroundColor: '#115293', boxShadow: '0px 12px 20px rgba(0, 0, 0, 0.3)' },
              transition: 'all 0.3s ease',
            }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              padding: '0.75rem 2rem',
              borderRadius: '30px',
              fontWeight: 'bold',
              fontSize: '1rem',
              color: 'white',
              borderColor: 'white',
              '&:hover': { borderColor: '#ccc', backgroundColor: 'rgba(255, 255, 255, 0.2)' },
              transition: 'all 0.3s ease',
            }}
          >
            Learn More
          </Button>
        </Box>
      </Box>

      <Container sx={{ py: 8 }}>
        <animated.div style={fadeIn}>
          <Typography
            variant="h4"
            component="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', color: '#333', mb: 4 }}
          >
            Why Choose Us?
          </Typography>
          <Typography
            variant="h6"
            component="p"
            align="center"
            sx={{ mb: 6, maxWidth: '700px', mx: 'auto', color: '#555' }}
          >
            We offer the best services to ensure you succeed in your journey. Here&apos;s why we stand out:
          </Typography>
        </animated.div>

        <animated.div style={scaleUp}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  textAlign: 'center',
                  padding: '2rem',
                  borderRadius: '15px',
                  backgroundColor: 'white',
                  boxShadow: '0px 8px 24px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0px 12px 32px rgba(0,0,0,0.2)',
                  },
                }}
              >
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Quality
                </Typography>
                <Typography variant="body1" component="p" sx={{ color: '#777' }}>
                  We ensure top-notch quality in everything we offer, from products to customer support.
                </Typography>
              </Box>
            </Grid>

            {/* Feature 2 */}
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  textAlign: 'center',
                  padding: '2rem',
                  borderRadius: '15px',
                  backgroundColor: 'white',
                  boxShadow: '0px 8px 24px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0px 12px 32px rgba(0,0,0,0.2)',
                  },
                }}
              >
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Innovation
                </Typography>
                <Typography variant="body1" component="p" sx={{ color: '#777' }}>
                  We are always innovating to bring you the latest and greatest in our field.
                </Typography>
              </Box>
            </Grid>

            {/* Feature 3 */}
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  textAlign: 'center',
                  padding: '2rem',
                  borderRadius: '15px',
                  backgroundColor: 'white',
                  boxShadow: '0px 8px 24px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0px 12px 32px rgba(0,0,0,0.2)',
                  },
                }}
              >
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Support
                </Typography>
                <Typography variant="body1" component="p" sx={{ color: '#777' }}>
                  Our support team is always here to help you with any issues or questions you may have.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </animated.div>
      </Container>
    </Box>
  );
}
