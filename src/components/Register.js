import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
    pinCode: '',
    city: '',
    country: '',
    password: ''
  });

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'pinCode' && e.target.value.length === 5) {
      fetchLocationData(e.target.value);
    }
  };

// New York, NY: 10001
// Los Angeles, CA: 90001
// Chicago, IL: 60601
// Houston, TX: 77001
// Philadelphia, PA: 19101
// Phoenix, AZ: 85001
// San Antonio, TX: 78201
// San Diego, CA: 92101
// Dallas, TX: 75201
// San Jose, CA: 95101

  const fetchLocationData = async (pinCode) => {
    try {
      const response = await axios.get(`https://api.zippopotam.us/us/${pinCode}`);
      
      // Check if data is returned and process it
      if (response.data && response.data.places && response.data.places.length > 0) {
        const place = response.data.places[0];
        setFormData({
          ...formData,
          city: place['place name'],
          country: response.data['country']
        });
      } else {
        console.error('No data found for the provided pin code.');
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };  

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/api/users/register', formData)
      .then(response => {
        console.log(response.data);
        // Show alert and navigate to login page on successful registration
        alert('Registered successfully!');
        navigate('/login');
      })
      .catch(error => {
        console.error(error);
        // Show alert for registration failure
        alert('Some error occurred. Please check logs.');
      });
  };

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Paper elevation={3} style={{ padding: '2rem', maxWidth: '500px', width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Register
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField 
              fullWidth 
              margin="normal" 
              name="username" 
              label="Username" 
              onChange={handleChange} 
            />
            <TextField 
              fullWidth 
              margin="normal" 
              name="email" 
              label="Email" 
              type="email" 
              onChange={handleChange} 
            />
            <TextField 
              fullWidth 
              margin="normal" 
              name="phoneNumber" 
              label="Phone Number" 
              onChange={handleChange} 
            />
            <TextField 
              fullWidth 
              margin="normal" 
              name="pinCode" 
              label="Pin Code" 
              onChange={handleChange} 
            />
            <TextField 
              fullWidth 
              margin="normal" 
              name="address" 
              label="Address" 
              onChange={handleChange} 
            />
            <TextField 
              fullWidth 
              margin="normal" 
              name="city" 
              label="City" 
              value={formData.city} 
              onChange={handleChange} 
              InputProps={{
                readOnly: true,
                style: { color: '#555' } // Darker gray color
              }}
            />
            <TextField 
              fullWidth 
              margin="normal" 
              name="country" 
              label="Country" 
              value={formData.country} 
              onChange={handleChange} 
              InputProps={{
                readOnly: true,
                style: { color: '#555' } // Darker gray color
              }}
            />
            <TextField 
              fullWidth 
              margin="normal" 
              name="password" 
              label="Password" 
              type="password" 
              onChange={handleChange} 
            />
            <Button 
              variant="contained" 
              color="primary" 
              type="submit" 
              fullWidth
            >
              Register
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default Register;
