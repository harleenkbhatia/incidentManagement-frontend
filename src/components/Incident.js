import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Modal,
  Fade,
  IconButton
} from '@mui/material';
import { Search, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Incident() {
  const location = useLocation();
  const [incidents, setIncidents] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [formData, setFormData] = useState({
    enterpriseOrGovernment: '',
    reporterName: '',
    incidentDetails: '',
    priority: 'Low',
    status: 'Open',
    incidentId: ''
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    if (location && location.state && location.state.currentUser) {
      setFormData(prevState => ({
        ...prevState,
        reporterName: location.state.currentUser.username
      }));
      fetchIncidents(location.state.currentUser.id); // Fetch incidents when component mounts
    }
  }, [location]);

  useEffect(() => {
    if (searchId === '') {
      // If searchId is empty, fetch all incidents
      fetchIncidents(location.state.currentUser.id);
    }
  }, [searchId]);

  const fetchIncidents = (userId) => {
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }

    axios.get(`http://localhost:8081/api/incidents/${userId}`)
      .then(response => {
        setIncidents(response.data);
      })
      .catch(error => {
        if (error.response) {
          console.error("Response error:", error.response.data);
        } else if (error.request) {
          console.error("Request error:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      });
  };

  const generateIncidentId = () => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const currentYear = new Date().getFullYear();
    return `RMG${randomDigits}${currentYear}`;
  };

  const handleCreateChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setSelectedIncident({ ...selectedIncident, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newIncident = { ...formData, incidentId: generateIncidentId() };
    const userId = location.state.currentUser.id;

    axios.post(`http://localhost:8081/api/incidents/addIncident?userId=${userId}`, newIncident)
      .then(response => {
        setIncidents([...incidents, response.data]);
        setFormData(prevState => ({
          ...prevState,
          enterpriseOrGovernment: '',
          incidentDetails: '',
          priority: 'Low',
          status: 'Open',
          incidentId: ''
        }));
      })
      .catch(error => {
        if (error.response) {
          console.error("Response error:", error.response.data);
        } else if (error.request) {
          console.error("Request error:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      });
  };

  const handleDelete = (incidentId) => {
    axios.delete(`http://localhost:8081/api/incidents/delete/${incidentId}`)
      .then(() => {
        setIncidents(incidents.filter(incident => incident.incidentId !== incidentId));
      })
      .catch(error => {
        if (error.response) {
          console.error("Response error:", error.response.data);
        } else if (error.request) {
          console.error("Request error:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchId === '') {
      // If searchId is empty, fetch all incidents
      fetchIncidents(location.state.currentUser.id);
    } else {
      axios.get(`http://localhost:8081/api/incidents/search?incidentId=${searchId}`)
        .then(response => {
          setIncidents([response.data]);
        })
        .catch(error => {
          if (error.response) {
            console.error("Response error:", error.response.data);
          } else if (error.request) {
            console.error("Request error:", error.request);
          } else {
            console.error("Error:", error.message);
          }
        });
    }
  };

  const openEditModal = (incident) => {
    setSelectedIncident({
      ...incident,
      incidentReportedDateTime: new Date(incident.incidentReportedDateTime).toISOString()
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedIncident(null);
    setEditModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedIncident) {
      return;
    }

    const updatedIncident = {
      id: selectedIncident.id,
      incidentId: selectedIncident.incidentId,
      reporterName: selectedIncident.reporterName,
      incidentDetails: selectedIncident.incidentDetails,
      enterpriseOrGovernment: selectedIncident.enterpriseOrGovernment,
      incidentReportedDateTime: selectedIncident.incidentReportedDateTime,
      priority: selectedIncident.priority,
      status: selectedIncident.status,
      user: {
        id: location.state.currentUser.id
      }
    };

    axios.put(`http://localhost:8081/api/incidents/update`, updatedIncident)
      .then(response => {
        const updatedIncidents = incidents.map(incident =>
          incident.id === response.data.id ? response.data : incident
        );
        setIncidents(updatedIncidents);
        closeEditModal();
      })
      .catch(error => {
        if (error.response) {
          console.error("Response error:", error.response.data);
        } else if (error.request) {
          console.error("Request error:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      });
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Report Incident
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl component="fieldset" margin="normal">
              <Typography component="legend">Enterprise or Government?</Typography>
              <RadioGroup
                name="enterpriseOrGovernment"
                value={formData.enterpriseOrGovernment}
                onChange={handleCreateChange}
              >
                <FormControlLabel value="Enterprise" control={<Radio />} label="Enterprise" />
                <FormControlLabel value="Government" control={<Radio />} label="Government" />
              </RadioGroup>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              name="reporterName"
              label="Reporter Name"
              value={formData.reporterName}
              disabled
            />
            <TextField
              fullWidth
              margin="normal"
              name="incidentDetails"
              label="Incident Details"
              multiline
              rows={4}
              value={formData.incidentDetails}
              onChange={handleCreateChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleCreateChange}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleCreateChange}
                disabled={formData.status === "Closed"}
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In progress">In progress</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!formData.enterpriseOrGovernment || !formData.incidentDetails}
            >
              Create Incident
            </Button>
          </form>
        </Paper>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Incidents
          </Typography>
          <Box display="flex" alignItems="center" marginBottom={2}>
            <TextField
              fullWidth
              margin="normal"
              name="searchId"
              label="Search Incident by ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <IconButton color="primary" onClick={handleSearch} title="Search">
              <Search />
            </IconButton>
          </Box>
          <List>
            {incidents.map(incident => (
              <ListItem key={incident.incidentId}>
                <ListItemText
                  primary={`Incident Id: ${incident.incidentId} Reported By: ${incident.reporterName}`}
                  secondary={`${incident.incidentDetails} Priority: ${incident.priority}, Status: ${incident.status}`}
                />
                {!incident.status || incident.status !== 'Closed' && (
                  <IconButton
                    color="primary"
                    onClick={() => openEditModal(incident)}
                    title="Edit"
                  >
                    <Edit />
                  </IconButton>
                )}
                <IconButton
                  color="secondary"
                  onClick={() => handleDelete(incident.incidentId)}
                  title="Delete"
                >
                  <Delete />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={closeEditModal}
        aria-labelledby="edit-incident-modal"
        aria-describedby="modal to edit incident details"
        closeAfterTransition
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fade in={editModalOpen}>
          <Paper elevation={3} sx={{ p: 4, maxWidth: 600 }}>
            <Typography variant="h5" gutterBottom>
              Edit Incident
            </Typography>
            <form onSubmit={handleEditSubmit}>
              <TextField
                fullWidth
                margin="normal"
                name="reporterName"
                label="Reporter Name"
                value={selectedIncident ? selectedIncident.reporterName : ''}
                disabled
              />
              <TextField
                fullWidth
                margin="normal"
                name="incidentDetails"
                label="Incident Details"
                multiline
                rows={4}
                value={selectedIncident ? selectedIncident.incidentDetails : ''}
                onChange={handleEditChange}
              />
              <FormControl component="fieldset" margin="normal">
                <Typography component="legend">Enterprise or Government?</Typography>
                <RadioGroup
                  name="enterpriseOrGovernment"
                  value={selectedIncident ? selectedIncident.enterpriseOrGovernment : ''}
                  onChange={handleEditChange}
                >
                  <FormControlLabel value="Enterprise" control={<Radio />} label="Enterprise" />
                  <FormControlLabel value="Government" control={<Radio />} label="Government" />
                </RadioGroup>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={selectedIncident ? selectedIncident.priority : ''}
                  onChange={handleEditChange}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={selectedIncident ? selectedIncident.status : ''}
                  onChange={handleEditChange}
                  disabled={selectedIncident && selectedIncident.status === "Closed"}
                >
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In progress">In progress</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!selectedIncident || !selectedIncident.incidentDetails}
              >
                Save Changes
              </Button>
            </form>
          </Paper>
        </Fade>
      </Modal>
    </Container>
  );
}

export default Incident;
