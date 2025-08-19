import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button, Nav,Dropdown } from 'react-bootstrap';
import { FaBell, FaUpload, FaHome, FaUser, FaSignOutAlt, FaFolderOpen, FaTrash, FaRegEnvelopeOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DashBoardFooter from '../Components/DashBoardFooter';


const notifications = [
  {
    title: 'New upload: "Chemistry Lab - Solutions"',
    detail: 'You uploaded "Chemistry Lab - Solutions". 15 May 2025',
    type: 'Upload',
  },
  {
    title: 'Download stats: "Math Quiz - Week 3"',
    detail: 'Students downloaded your material 8 times this week.',
    type: 'Account activity',
  },
  {
    title: 'System alert: Maintenance scheduled',
    detail: 'System will be down for maintenance on 18 May 2025, 9–11am.',
    type: 'System alerts',
  },
];
const Notice = () => {
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
            <h5>Notification</h5>
            <Card className="p-4 m-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Dropdown>
          <Dropdown.Toggle variant="light" size="sm">
            Filter: All
          </Dropdown.Toggle>
        </Dropdown>
        <Button variant="dark" size="sm">
          Mark all as read
        </Button>
      </div>

      {notifications.map((item, index) => (
        <Card key={index} className="mb-2 p-3 shadow-sm">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <strong>{item.title}</strong>
              <p className="mb-1 small">{item.detail}</p>
              <span className="text-muted small">{item.type}</span>
            </div>
            <div className="d-flex gap-2">
              <FaRegEnvelopeOpen className="text-secondary" title="Mark as read" />
              <FaTrash className="text-danger" title="Delete" />
            </div>
          </div>
        </Card>
      ))}

      <div className="text-center mt-3">
        <Button variant="light" size="sm">Load More</Button>
      </div>
    </Card>

          </div>

          {/* Footer */}
          <DashBoardFooter />
        </Col>
      </Row>
    </Container>
  );
};

export default Notice;
