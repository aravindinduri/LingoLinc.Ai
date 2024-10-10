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
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to Lingolinc
        </Typography>
        <Typography variant="h5" component="p" gutterBottom sx={{ maxWidth: '600px', marginBottom: '2rem' }}>
          Join us on an incredible journey to explore new opportunities. Let's achieve success together!
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
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#115293' },
            }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            sx={{
              padding: '0.75rem 2rem',
              borderRadius: '30px',
              fontWeight: 'bold',
              color: 'white',
              borderColor: 'white',
              '&:hover': { borderColor: '#ccc' },
            }}
          >
            Learn More
          </Button>
        </Box>
      </Box>

      <Container sx={{ py: 8 }}>
        <animated.div style={fadeIn}>
          <Typography variant="h4" color='white' component="h2" align="center" gutterBottom>
            Why Choose Us?
          </Typography>
          <Typography variant="h6"color='white' component="p" align="center" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
            We offer the best services to ensure you succeed in your journey. Here's why we stand out:
          </Typography>
        </animated.div>
        
        <animated.div style={scaleUp}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  textAlign: 'center',
                  padding: '2rem',
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  backgroundColor: '#f9f9f9',
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <Typography variant="h6" component="h3" gutterBottom>
                  Quality
                </Typography>
                <Typography variant="body1" component="p">
                  We ensure top-notch quality in everything we offer, from products to customer support.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  textAlign: 'center',
                  padding: '2rem',
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  backgroundColor: '#f9f9f9',
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <Typography variant="h6" component="h3" gutterBottom>
                  Innovation
                </Typography>
                <Typography variant="body1" component="p">
                  We are always innovating to bring you the latest and greatest in our field.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  textAlign: 'center',
                  padding: '2rem',
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  backgroundColor: '#f9f9f9',
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <Typography variant="h6" component="h3" gutterBottom>
                  Support
                </Typography>
                <Typography variant="body1" component="p">
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
