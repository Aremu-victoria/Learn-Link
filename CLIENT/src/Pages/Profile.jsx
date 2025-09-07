import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button, Nav,Form } from 'react-bootstrap';
import { FaBell, FaUpload, FaHome, FaUser, FaSignOutAlt, FaFolderOpen,FaCloudUploadAlt, FaUserEdit } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import DashBoardFooter from '../Components/DashBoardFooter';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [nameInput, setNameInput] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [message, setMessage] = useState('');

      useEffect(() => {
        const hydrate = async () => {
          try {
            const cached = localStorage.getItem('user');
            if (cached) {
              setUser(JSON.parse(cached));
            }
            if (!token) {
              navigate('/signin');
              return;
            }
            const res = await axios.get('https://learn-link-1.onrender.com/verify', {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data?.user) {
              setUser(res.data.user);
              setNameInput(res.data.user.name || '');
              localStorage.setItem('user', JSON.stringify(res.data.user));
            }
          } catch (e) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/signin');
          }
        };
        hydrate();
      }, [token, navigate]);

      const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/signin');
      };
    
      const handleSave = async (e) => {
        e.preventDefault();
        setMessage('');
        setSaving(true);
        try {
          // Update name if changed
          if (nameInput && nameInput !== user?.name) {
            const res = await axios.patch('https://learn-link-1.onrender.com/me', { name: nameInput }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
          // Change password if provided
          if (newPassword || confirmPassword) {
            if (newPassword !== confirmPassword) {
              setMessage('Passwords do not match');
              setSaving(false);
              return;
            }
            await axios.patch('https://learn-link-1.onrender.com/me/password', {
              currentPassword: '',
              newPassword
            }, { headers: { Authorization: `Bearer ${token}` } });
          }
          setMessage('Profile saved');
          setNewPassword('');
          setConfirmPassword('');
        } catch (err) {
          setMessage(err.response?.data?.message || 'Failed to save changes');
        } finally {
          setSaving(false);
        }
      };

      const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarUploading(true);
        setMessage('');
        try {
          const fd = new FormData();
          fd.append('avatar', file);
          const res = await axios.post('https://learn-link-1.onrender.com/me/avatar', fd, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
          });
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
          setMessage('Avatar updated');
        } catch (err) {
          setMessage(err.response?.data?.message || 'Avatar upload failed');
        } finally {
          setAvatarUploading(false);
        }
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
            <h5>Profile</h5>
            <div className="container py-4">
      <Row>
        {/* Left Panel */}
        <Col md={4} className="mb-4">
          <Card className="text-center p-3">
            <div className="d-flex flex-column align-items-center">
              <div className="position-relative mb-3">
                <img
                  src={user?.avatar ? `https://learn-link-1.onrender.com${user.avatar}` : 'https://i.imgur.com/0y0y0y0.png'}
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
              <h5>{user?.name || ''}</h5>
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
                    <Form.Control type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" defaultValue={user?.email || ''} readOnly />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="formProfilePicture" className="mb-3">
                <Form.Label>Profile Picture</Form.Label>
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={user?.avatar ? `https://learn-link-1.onrender.com${user.avatar}` : 'https://i.imgur.com/0y0y0y0.png'}
                    alt="profile"
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                  <input id="avatarInput" type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
                  <Button variant="light" disabled={avatarUploading} onClick={() => document.getElementById('avatarInput').click()}>
                    <FaCloudUploadAlt className="me-1" />
                    {avatarUploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </Form.Group>

              {message && <div className="alert alert-info py-2">{message}</div>}

              <Button variant="dark" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
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
