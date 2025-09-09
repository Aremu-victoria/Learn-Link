import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button, Nav, Form } from 'react-bootstrap';
import { FaBell, FaUpload, FaHome, FaUser, FaSignOutAlt, FaFolderOpen, FaEye, FaDownload } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import DashBoardFooter from '../Components/DashBoardFooter';
import axios from 'axios';

const ViewMaterial = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Base URL of deployed API
  const BASE_URL = 'https://learn-link-1.onrender.com';

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        // Fetch user data
        const userResponse = await axios.get("https://learn-link-1.onrender.com/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setUser(userResponse.data.user);
        
        // Get user role from localStorage
        const role = localStorage.getItem('userRole');
        if (role) {
          setUserRole(role);
        }

        // Fetch materials based on user role
        if (role === 'student') {
          // Students see all materials from all teachers
          const allMaterialsResponse = await axios.get(`${BASE_URL}/materials`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMaterials(allMaterialsResponse.data || []);
        } else {
          // Teachers see only their own materials
          const dashboardResponse = await axios.get(`${BASE_URL}/dashboard`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMaterials(dashboardResponse.data?.materials || []);
        }
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin");
        } else {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [token, navigate]);

  return (
    <Container fluid>
      <Row className="min-vh-100">
        {/* Sidebar */}
        <Col md={2} className="bg-dark text-white p-3">
          <h5 className="mb-4"> <FaHome className="me-2" />School System</h5>
          {userRole && (
            <div className="mb-3 p-2 bg-primary rounded text-center">
              <small className="text-white">
                <strong>{userRole === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}</strong>
              </small>
            </div>
          )}
          <Nav className="flex-column gap-3">
            {userRole === 'teacher' && (
              <Link to='/dashboard' className='text-white' style={{ textDecoration: 'none' }}><FaHome className="me-2" />Dashboard</Link>
            )}
            {userRole === 'teacher' && (
              <Link to='/uploadMaterial' className='text-white' style={{ textDecoration: 'none' }}><FaUpload className="me-2" />Upload Materials</Link>
            )}
            <Link to='/viewMaterial' className='text-white' style={{ textDecoration: 'none' }}> <FaFolderOpen className="me-2" />{userRole === 'teacher' ? 'My Materials' : 'View Materials'}</Link>
            <Link to='/profile' className='text-white' style={{ textDecoration: 'none' }}> <FaUser className="me-2" />My Profile</Link>
            <Link to='/notification' className='text-white' style={{ textDecoration: 'none' }}><FaBell className="me-2" />Notifications</Link>
            <Nav.Link className="text-white" onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('userRole');
              navigate('/signin');
            }}><FaSignOutAlt className="me-2" />Logout</Nav.Link>
          </Nav>
        </Col>

        {/* Main Dashboard */}
        <Col md={10} className="bg-light">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom bg-white">
            <div>
              <strong>Welcome back, {user?.name || 'User'}!</strong>
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
            <h5>{userRole === 'teacher' ? 'My Materials' : 'View Materials'}</h5>
            {userRole === 'student' && (
              <p className="text-muted">Browse materials shared by your teachers</p>
            )}

            <div className="container py-4">
              <Row className="mb-3 g-2">
                <Col md={3}><Form.Control placeholder="Search by title" /></Col>
                <Col md={3}>
                  <Form.Select>
                    <option>All Subjects</option>
                    <option>Mathematics</option>
                    <option>English</option>
                    <option>Science</option>
                    <option>History</option>
                    <option>Language</option>
                    <option>Arts</option>
                  </Form.Select>
                </Col>
                <Col md={3}><Form.Control placeholder="Uploader name" /></Col>
                <Col md={3}><Form.Control placeholder="mm/dd/yyyy" /></Col>
              </Row>

              {loading ? (
                <div>Loading...</div>
              ) : (
                <>
                  <Row className="g-4">
                    {materials.length === 0 ? (
                      <div>No materials found.</div>
                    ) : (
                      (userRole === 'student'
                        ? materials.slice(0, visibleCount)
                        : materials
                      ).map((item, idx) => (
                        <Col md={4} sm={6} xs={12} key={idx}>
                          <Card className="p-3 h-100 shadow-sm">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="badge bg-light text-dark">{item.subject}</span>
                            </div>
                            <h6>{item.title}</h6>
                            <p className="small">{item.description}</p>
                            {userRole === 'student' && item.uploadedBy && (
                              <p className="small text-muted">
                                <strong>Teacher:</strong> {item.uploadedBy}
                              </p>
                            )}
                            <div className="d-flex justify-content-between align-items-center">
                              <small>
                                Uploaded: {item.uploadDate ? new Date(item.uploadDate).toLocaleString() : 'N/A'}
                              </small>
                              <div className="d-flex gap-2">
                                {item.fileUrl && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="dark"
                                      as="a"
                                      href={`${BASE_URL}${item.fileUrl}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <FaEye />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline-dark"
                                      as="a"
                                      href={`${BASE_URL}${item.fileUrl}`}
                                      download
                                    >
                                      <FaDownload />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </Card>
                        </Col>
                      ))
                    )}
                  </Row>
                  {userRole === 'student' && visibleCount < materials.length && (
                    <div className="text-center mt-4">
                      <Button variant="light" onClick={() => setVisibleCount(visibleCount + 6)}>Load More</Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <DashBoardFooter />
        </Col>
      </Row>
    </Container>
  );
};

export default ViewMaterial;
