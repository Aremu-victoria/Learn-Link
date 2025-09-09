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
const [userRole, setUserRole] = useState(null);
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
    const role = localStorage.getItem('userRole');
    if (cachedUser) {
      const parsed = JSON.parse(cachedUser);
      if (parsed && parsed.name) {
        setUser(parsed);
      }
    }
    if (role) {
      setUserRole(role);
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
          {userRole && (
            <div className="mb-3 p-2 bg-primary rounded text-center">
              <small className="text-white">
                <strong>{userRole === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}</strong>
              </small>
            </div>
          )}
          <Nav className="flex-column gap-3">
            {userRole === 'teacher' && (
              <Link to='/dashboard' className='text-white' style={{textDecoration:'none'}}><FaHome className="me-2" />Dashboard</Link>
            )}
            {userRole === 'teacher' && (
              <Link to='/uploadMaterial' className='text-white' style={{textDecoration:'none'}}><FaUpload className="me-2" />Upload Materials</Link>
            )}
            <Link to='/viewMaterial' className='text-white' style={{textDecoration:'none'}}> <FaFolderOpen className="me-2" />{userRole === 'teacher' ? 'My Materials' : 'View Materials'}</Link>
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
              <strong>
                {((statistics?.materialsUploaded || 0) === 0 ? 'Welcome, ' : 'Welcome back, ')}
                {user?.name || ''}
              </strong>
              {userRole && (
                <span className="ms-2 badge bg-primary">
                  {userRole === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}
                </span>
              )}
            </div>
            <div>
              <FaBell className="me-2" />
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
                { title: "Storage Used", value: `${statistics.storageUsed} files` },
                { title: "Account Age", value: `${statistics.accountAge} days` },
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

            {/* Additional Info Cards */}
            <Row className="mb-4">
              <Col md={12}>
                <h5 className="mb-3">Materials</h5>
                <Row>
                  {materials.length === 0 ? (
                    <Col><div className="text-muted">No materials found.</div></Col>
                  ) : (
                    materials.map((material, idx) => (
                      <Col key={idx} md={4} sm={6} xs={12} className="mb-3">
                        <Card className="shadow-sm h-100">
                          <Card.Body>
                            <Card.Title>{material.title}</Card.Title>
                            <div className="mb-2 text-muted" style={{ fontSize: '14px' }}>
                              Subject: {material.subject}
                            </div>
                            <div className="mb-2" style={{ fontSize: '13px' }}>
                              {material.description}
                            </div>
                            <div className="mb-2 text-muted" style={{ fontSize: '13px' }}>
                              Uploaded: {new Date(material.uploadDate).toLocaleDateString()}
                            </div>
                            {userRole === 'student' && (
                              <div className="mb-2 text-primary" style={{ fontSize: '13px' }}>
                                Teacher: {material.teacherName || 'Unknown'}
                              </div>
                            )}
                            <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm mt-2">
                              <FaDownload className="me-1" /> Download
                            </a>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                  )}
                </Row>
              </Col>
            </Row>

            
        
          </div>

          {/* Footer */}
          <DashBoardFooter />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
