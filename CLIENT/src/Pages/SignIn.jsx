import React, { useState } from 'react';
import BookLover from '../assets/signin.png';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import axios from 'axios';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('https://learn-link-1.onrender.com/signin', formData);
      console.log('Backend response:', response.data);
      
      if (!response.data.token) {
        throw new Error('No authentication token received');
      }

      // Store authentication data
      localStorage.setItem('token', response.data.token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userRole', response.data.user.role);
      }

      // Redirect to dashboard
      navigate('/viewMaterial');
    } catch (error) {
      if (error.response) {

        setError(error.response.data.message || 'Login failed. Please check your credentials.');
      } else if (error.request) {

        setError('Network error. Please check your connection.');
      } else {
        // Other errors
        setError('An unexpected error occurred. Please try again.');
      }
      
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <Link to="/" className="back-arrow p-3 fs-3 text-dark" title="Back to Home Page">
        <FaRegArrowAltCircleLeft />
      </Link>


      <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="row shadow rounded overflow-hidden w-100" style={{ maxWidth: '900px' }}>
          
          <div className="col-md-6 d-none d-md-flex bg-secondary-subtle flex-column justify-content-center align-items-center p-4">
            <div className="text-center">
              <img 
                src={BookLover} 
                alt="Sign in illustration" 
                width={400} 
                className="img-fluid"
              />
              <p className="text-muted small mt-2">
                Academic Collaboration & Secure Cloud
              </p>
            </div>
          </div>

          <div className="col-md-6 bg-white p-4">
            <div className="text-center mb-4">
              <div className="bg-dark text-white rounded px-3 py-1 d-inline-block mb-2">
                ISS
              </div>
              <h5 className="mb-1">Integrated School System</h5>
              <p className="text-muted">Welcome back! Please sign in to continue.</p>
            </div>


            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="you@email.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="d-flex flex-wrap gap-2 mb-3">
                <Link 
                  to="/forgot-password" 
                  className="ms-auto small text-decoration-none align-self-center"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-dark"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span 
                        className="spinner-border spinner-border-sm me-2" 
                        role="status" 
                        aria-hidden="true"
                      ></span>
                      Signing In...
                    </>
                  ) : 'Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;