import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button, Nav,Dropdown } from 'react-bootstrap';
import { FaBell, FaUpload, FaHome, FaUser, FaSignOutAlt, FaFolderOpen, FaTrash, FaRegEnvelopeOpen } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import DashBoardFooter from '../Components/DashBoardFooter';
import axios from 'axios';


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
    const handleMarkAsRead = async (id) => {
      try {
        await axios.patch(`https://learn-link-1.onrender.com/notifications/${id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(prev => prev.map(item => item._id === id ? { ...item, isRead: true } : item));
      } catch {}
    };

    const handleDelete = async (id) => {
      try {
        await axios.delete(`https://learn-link-1.onrender.com/notifications/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(prev => prev.filter(item => item._id !== id));
      } catch {}
    };
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [items, setItems] = useState([]);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
      const hydrate = async () => {
        try {
          const cached = localStorage.getItem('user');
          if (cached) {
            const parsed = JSON.parse(cached);
            setUser(parsed);
            setUserRole(parsed.role || localStorage.getItem('userRole'));
          }
          if (!token) { navigate('/signin'); return; }
          const res = await axios.get('https://learn-link-1.onrender.com/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data?.user) {
            setUser(res.data.user);
            setUserRole(res.data.user.role);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
          fetchNotifications(0);
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/signin');
        }
      };
      hydrate();
      // eslint-disable-next-line
    }, [token, navigate]);

    const fetchNotifications = async (newSkip) => {
      setLoading(true);
      try {
        // If backend supports skip/limit, use: `/notifications?skip=${newSkip}&limit=5`
        const res = await axios.get('https://learn-link-1.onrender.com/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Simulate pagination client-side for now
        const batch = res.data.slice(newSkip, newSkip + 5);
        setItems(prev => [...prev, ...batch]);
        setSkip(newSkip + batch.length);
        setHasMore(batch.length === 5 && (newSkip + batch.length) < res.data.length);
      } catch {
        setHasMore(false);
      }
      setLoading(false);
    };

    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/signin');
    };
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
          {userRole && (
            <div className="mb-3 p-2 bg-primary rounded text-center">
              <small className="text-white">
                <strong>{userRole === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}</strong>
              </small>
            </div>
          )}
          <Nav className="flex-column gap-3">
            <Link to='/dashboard' className='text-white' style={{textDecoration:'none'}}><FaHome className="me-2" />Dashboard</Link>
            <Link to='/uploadMaterial' className='text-white' style={{textDecoration:'none'}}><FaUpload className="me-2" />Upload Materials</Link>
            <Link to='/viewMaterial' className='text-white' style={{textDecoration:'none'}}> <FaFolderOpen className="me-2" />View Materials</Link>
            <Link to='/profile' className='text-white' style={{textDecoration:'none'}}> <FaUser className="me-2" />My Profile</Link>
            <Link to='/notification' className='text-white' style={{textDecoration:'none'}}><FaBell className="me-2" />Notifications</Link>
            <Nav.Link onClick={handleLogout} className="text-white" role="button"><FaSignOutAlt className="me-2" />Logout</Nav.Link>
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

      {items.length === 0 && !loading && (
        <div className="text-muted text-center">No notifications found.</div>
      )}
      {items.map((item, index) => (
        <Card key={index} className={`mb-2 p-3 shadow-sm ${item.isRead ? 'bg-light' : ''}`}>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <strong>{item.title || item.message}</strong>
              <p className="mb-1 small">{item.message || item.detail}</p>
              <span className="text-muted small">{item.type}</span>
            </div>
            <div className="d-flex gap-2">
              <FaRegEnvelopeOpen
                className={`text-secondary ${item.isRead ? 'opacity-50' : 'cursor-pointer'}`}
                title="Mark as read"
                style={{ cursor: item.isRead ? 'default' : 'pointer' }}
                onClick={() => !item.isRead && handleMarkAsRead(item._id)}
              />
              <FaTrash
                className="text-danger cursor-pointer"
                title="Delete"
                style={{ cursor: 'pointer' }}
                onClick={() => handleDelete(item._id)}
              />
            </div>
          </div>
        </Card>
      ))}
      <div className="text-center mt-3">
        {hasMore && (
          <Button variant="light" size="sm" onClick={() => fetchNotifications(skip)} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        )}
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
