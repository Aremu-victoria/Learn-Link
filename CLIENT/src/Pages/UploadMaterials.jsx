import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { FaBell, FaUpload, FaHome, FaUser, FaSignOutAlt, FaFolderOpen } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import DashBoardFooter from '../Components/DashBoardFooter';
import axios from 'axios';

const UploadMaterials = () => {
  const [form, setForm] = useState({
    title: '',
    subject: '',
    description: ''
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        navigate("/signin");
        return;
      }
      
      try {
        const response = await axios.get("https://learn-link-1.onrender.com/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setUser(response.data.user);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin");
        }
      }
    };

    fetchUser();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('subject', form.subject);
    formData.append('description', form.description);
    formData.append('file', file);

    try {
      const res = await axios.post(
        'https://learn-link-1.onrender.com/upload-material',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setMessage('Material uploaded successfully!');
      setForm({ title: '', subject: '', description: '' });
      setFile(null);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (err) {
      console.error('Upload error:', err);
      setMessage('Upload failed. Please try again.');
    }
  };

  return (
    <Container fluid>
      <Row className="min-vh-100">
        <Col md={2} className="bg-dark text-white p-3">
          <h5 className="mb-4"><FaHome className="me-2" />Learn Link</h5>
          <Nav className="flex-column gap-3">
            <Link to='/dashboard' className='text-white' style={{ textDecoration: 'none' }}><FaHome className="me-2" />Dashboard</Link>
            <Link to='/uploadMaterial' className='text-white' style={{ textDecoration: 'none' }}><FaUpload className="me-2" />Upload Materials</Link>
            <Link to='/viewMaterial' className='text-white' style={{ textDecoration: 'none' }}><FaFolderOpen className="me-2" />View Materials</Link>
            <Link to='/profile' className='text-white' style={{ textDecoration: 'none' }}><FaUser className="me-2" />My Profile</Link>
            <Link to='/notification' className='text-white' style={{ textDecoration: 'none' }}><FaBell className="me-2" />Notifications</Link>
            <Nav.Link className="text-white"><FaSignOutAlt className="me-2" />Logout</Nav.Link>
          </Nav>
        </Col>

        <Col md={10} className="bg-light">
          <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom bg-white">
            <div>
              <strong>Welcome back, {user?.name || 'User'}!</strong>
            </div>
            <div>
              <FaBell className="me-2" />
              <span className="badge bg-secondary">Role: Teacher</span>
            </div>
          </div>

          <div className="px-4 py-3">
            <h5>Upload Materials</h5>

            <div className="container mt-5">
              <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10 col-sm-12">
                  <div className="card shadow-sm">
                    <div className="card-header text-white" style={{ backgroundColor: '#212529' }}>
                      <h4 className="mb-0">Upload New Material</h4>
                      <p className="mb-0">Fill out the details and upload your educational material below.</p>
                    </div>

                    <div className="card-body">
                      {message && (
                        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
                          {message}
                        </div>
                      )}

                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="title" className="form-label fw-bold">Title</label>
                          <input
                            type="text"
                            className="form-control"
                            id="title"
                            name="title"
                            placeholder="Enter material title"
                            value={form.title}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="subject" className="form-label fw-bold">Subject</label>
                          <select
                            className="form-select"
                            id="subject"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select subject</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Science">Science</option>
                            <option value="History">History</option>
                            <option value="Language">Language</option>
                            <option value="Arts">Arts</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="description" className="form-label fw-bold">Description</label>
                          <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            rows="3"
                            placeholder="Brief description of the material"
                            value={form.description}
                            onChange={handleChange}
                          ></textarea>
                        </div>

                        <div className="mb-4">
                          <label htmlFor="file" className="form-label fw-bold">Upload File</label>
                          <div className="input-group">
                            <input
                              type="file"
                              className="form-control"
                              id="file"
                              name="file"
                              accept=".pdf,.docx,image/*,video/*"
                              onChange={handleFileChange}
                              ref={fileInputRef}
                              required
                            />
                          </div>
                          <div className="form-text">
                            Accepted: PDF, DOCX, Images, Videos
                          </div>
                        </div>

                        <div className="d-grid">
                          <button type="submit" className="btn text-light btn-lg" style={{ backgroundColor: '#212529' }}>
                            Upload Material
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <DashBoardFooter />
        </Col>
      </Row>
    </Container>
  );
};

export default UploadMaterials;
