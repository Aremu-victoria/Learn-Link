import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button, Nav } from 'react-bootstrap';
import { FaDownload, FaEye, FaBell, FaUpload, FaHome, FaUser, FaSignOutAlt, FaFolderOpen } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import DashBoardFooter from '../Components/DashBoardFooter';
import { useEffect } from 'react';
import axios from 'axios';

const DashboardPage = () => {

const [user, setUser] = useState(null);
const [materials, setMaterials] = useState([]);
const [statistics, setStatistics] = useState({
  materialsUploaded: 0,
  newThisWeek: 0,
  totalDownloads: 0,
  activeStudents: 0
});
const token = localStorage.getItem("token");
const navigate = useNavigate(); 

// Show the real name instantly from localStorage (before API responds)
useEffect(() => {
  try {
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      const parsed = JSON.parse(cachedUser);
      if (parsed && parsed.name) {
        setUser(parsed);
      }
    }
  } catch {}
}, []);

useEffect(() => {
  const fetchData = async () => {
    try {
      const verifyResponse = await axios.get("https://learn-link-1.onrender.com/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      setUser(verifyResponse.data.user);
      const dashboardResponse = await axios.get("https://learn-link-1.onrender.com/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Update state with dashboard data
      if (dashboardResponse.data.user) {
        setUser(dashboardResponse.data.user);
      }
      setMaterials(dashboardResponse.data.materials || []);
      setStatistics(dashboardResponse.data.statistics || {
        materialsUploaded: 0,
        newThisWeek: 0,
        totalDownloads: 0,
        activeStudents: 0
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/signin"); 
      } else {
        console.error("Error fetching data:", error);
      }
    }
  };

  if (token) {
    fetchData();
  } else {
    navigate("/signin"); 
  }
}, [token, navigate]);

  return (
    <Container fluid>
      <Row className="min-vh-100">
        {/* Sidebar */}
        <Col md={2} className="bg-dark text-white p-3">
          <h5 className="mb-4"> <FaHome className="me-2" />Learn Link</h5>
            <Nav className="flex-column gap-3">
                    <Link to='/dashboard' className='text-white' style={{textDecoration:'none'}}><FaHome className="me-2" />Dashboard</Link>
                      <Link to='/uploadMaterial' className='text-white' style={{textDecoration:'none'}}><FaUpload className="me-2" />Upload Materials</Link> 
                      <Link to='/viewMaterial' className='text-white' style={{textDecoration:'none'}}> <FaFolderOpen className="me-2" />View Materials</Link>
                      <Link to='/profile' className='text-white' style={{textDecoration:'none'}}> <FaUser className="me-2" />My Profile</Link>
                      <Link to='/notification' className='text-white' style={{textDecoration:'none'}}><FaBell className="me-2" />Notifications</Link>
                          <Nav.Link className="text-white"><FaSignOutAlt className="me-2" />Logout</Nav.Link>
                      </Nav>
        </Col>

        {/* Main Dashboard */}
        <Col md={10} className="bg-light">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom bg-white">
            <div>
              <strong>Welcome back, {user?.name || ''}</strong>
            </div>
            <div>
              <FaBell className="me-2" />
              <span className="badge bg-secondary">Role: Teacher</span>
            </div>
          </div>

          <div className="px-4 py-3">
            <h5>Dashboard Overview</h5>
            <p>Manage and explore your educational materials</p>

            {/* Stats Cards */}
            <Row className="mb-4">
              {[
                { title: "Materials Uploaded", value: statistics.materialsUploaded },
                { title: "New This Week", value: statistics.newThisWeek },
                { title: "Total Downloads", value: statistics.totalDownloads },
                { title: "Active Students", value: statistics.activeStudents },
              ].map((stat, idx) => (
                <Col key={idx} md={3} sm={6} xs={12} className="mb-3">
                  <Card className="shadow-sm">
                    <Card.Body>
                      <Card.Title className="text-muted" style={{ fontSize: '14px' }}>{stat.title}</Card.Title>
                      <h3>{stat.value}</h3>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Upload Button */}
            <div className="text-end mb-3">
              <Button variant="dark"><FaUpload className="me-1" /> Upload Material</Button>
            </div>

        
          </div>

          {/* Footer */}
          <DashBoardFooter />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
