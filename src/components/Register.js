import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'pinCode' && value.length === 5) {
      fetchLocationData(value);
    }
  };

  const fetchLocationData = async (pinCode) => {
    try {
      const response = await axios.get(`https://api.zippopotam.us/us/${pinCode}`);
      if (response.data && response.data.places && response.data.places.length > 0) {
        const place = response.data.places[0];
        setFormData(prevState => ({
          ...prevState,
          city: place['place name'],
          country: response.data['country']
        }));
      } else {
        console.error('No data found for the provided pin code.');
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData); // Log formData before submission

    axios.post('http://localhost:8081/api/users/register', formData)
      .then(response => {
        console.log(response.data);
        alert('Registered successfully!');
        navigate('/login');
      })
      .catch(error => {
        if (error.response && error.response.status === 409) {
          alert('User with this email ID already exists!');
        } else {
          alert('Some error occurred. Please check logs.');
        }
        console.error(error);
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
                style: { color: '#555' }
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
                style: { color: '#555' }
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
