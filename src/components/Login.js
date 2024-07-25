import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box, Link } from '@mui/material';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State to manage error message
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/api/users/login', { email, password })
      .then(response => {
        console.log(response.data); // Assuming response.data is the user object returned from the backend
        // Navigate to incidents page on successful login
        navigate('/incidents', { state: { currentUser: response.data } }); // Pass currentUser as state
      })
      .catch(error => {
        console.error(error); // Log any network or other errors
        setError('Email or password is incorrect'); // Set error message for incorrect credentials
      });
  };

  return (
    <Container>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 3 }}
            >
              LOG ME IN!
            </Button>
          </form>
          <Typography variant="body2" sx={{ mt: 2 }}>
            <Link component={RouterLink} to="/register" color="primary">New User? Sign Up</Link> | <Link component={RouterLink} to="/forgot-password" color="primary">Forgot Password?</Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
