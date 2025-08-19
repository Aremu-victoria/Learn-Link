import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button, Nav,Form } from 'react-bootstrap';
import { FaBell, FaUpload, FaHome, FaUser, FaSignOutAlt, FaFolderOpen,FaCloudUploadAlt, FaUserEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DashBoardFooter from '../Components/DashBoardFooter';

const Profile = () => {
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        description: '',
        file: null
      });
    
      const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: files ? files[0] : value
        }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log(formData);
        alert('Material uploaded successfully!');
      };
  return (
    <Container fluid>
      <Row className="min-vh-100">
        {/* Sidebar */}
        <Col md={2} className="bg-dark text-white p-3">
          <h5 className="mb-4"> <FaHome className="me-2" />School System</h5>
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
              <strong>Welcome back, Alex Kim!</strong>
            </div>
            <div>
              <FaBell className="me-2" />
              <span className="badge bg-secondary">Role: Teacher</span>
            </div>
          </div>

          <div className="px-4 py-3">
            <h5>Profile</h5>
            <div className="container py-4">
      <Row>
        {/* Left Panel */}
        <Col md={4} className="mb-4">
          <Card className="text-center p-3">
            <div className="d-flex flex-column align-items-center">
              <div className="position-relative mb-3">
                <img
                  src="https://i.imgur.com/0y0y0y0.png"
                  alt="profile"
                  className="rounded-circle"
                  width="100"
                  height="100"
                />
                <FaUserEdit
                  className="position-absolute bottom-0 end-0 bg-white p-1 rounded-circle"
                  style={{ fontSize: "1.2rem" }}
                />
              </div>
              <h5>Alex Kim</h5>
              <p className="text-muted">Teacher</p>
              <Button variant="dark" className="mb-3">
                Uploaded Materials: 25
              </Button>
              <div className="text-start w-100">
                <p className="mb-1">
                  📄 Uploaded <br />
                  <small>“Math Quiz - Week 3”</small>
                </p>
                <p className="mb-1">
                  📄 Uploaded <br />
                  <small>“Science Notes - Plants”</small>
                </p>
                <p className="mb-1">
                  ✏️ Edited <br />
                  <small>“Essay Writing Guide”</small>
                </p>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Panel */}
        <Col md={8}>
          <Card className="p-4">
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" defaultValue="Alex Kim" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" defaultValue="alex.kim@email.com" />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="New password" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm new password" />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="formProfilePicture" className="mb-3">
                <Form.Label>Profile Picture</Form.Label>
                <div className="d-flex align-items-center gap-3">
                  <img
                    src="https://i.imgur.com/0y0y0y0.png"
                    alt="profile"
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                  <Button variant="light">
                    <FaCloudUploadAlt className="me-1" />
                    Upload
                  </Button>
                </div>
              </Form.Group>

              <Button variant="dark" type="submit">
                Save Changes
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>

          </div>

          {/* Footer */}
          <DashBoardFooter />
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
