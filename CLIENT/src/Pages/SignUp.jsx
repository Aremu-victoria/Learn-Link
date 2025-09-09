import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useNavigate} from 'react-router-dom';
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import axios from 'axios';
const Register = () => {
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
      e.preventDefault();
      setError('');
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      setIsLoading(true);
      const allValues = { name, email, password, role };
      // const url = 'http://localhost:5000/signup';
      const url = 'https://learn-link-1.onrender.com/signup';
      axios
        .post(url, allValues)
        .then((res) => {
          setError('');
          navigate('/signin');
        })
        .catch((err) => {
          if (err.response && err.response.status === 409) {
            setError('Email already in use. Please use a different email.');
          } else {
            setError('Registration failed. Please try again.');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
  };

  return (
    <>
      <Link to='/' className='p-3 fs-3 text-dark' title='Back to Home Page'><FaRegArrowAltCircleLeft /></Link>
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light p-5">
        <div className="row w-100 mx-2 shadow-lg rounded overflow-hidden" style={{ maxWidth: '1000px' }}>
          <div className="col-md-6 bg-light d-flex flex-column justify-content-center align-items-center p-4 text-center">
            <div className="bg-secondary rounded p-4" style={{ width: '250px' }}>
              <div
                className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center mb-3"
                style={{ width: '100px', height: '100px', margin: '0 auto' }}
                >
                Academic<br />Illustration
              </div>
              <div className="d-flex justify-content-around mb-2">
                <i className="bi bi-person text-white bg-dark rounded-circle p-2"></i>
                <i className="bi bi-cloud-arrow-up text-white bg-dark rounded-circle p-2"></i>
                <i className="bi bi-mortarboard text-white bg-dark rounded-circle p-2"></i>
              </div>
              <p className="text-secondary small mt-2">Students, Teachers & Cloud Collaboration</p>
            </div>
          </div>
          <div className="col-md-6 bg-white p-4">
            <div className="text-center mb-4">
              <div
                className="bg-dark text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{ width: '50px', height: '50px' }}
                >
                LL
              </div>
              <h5 className="mt-3">Create Your Account</h5>
              <p className="text-muted small">Join the platform where education meets convenience.</p>
            </div>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input type="text" className="form-control" placeholder="Your Full Name"  onChange={(e) => setname(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input type="email" className="form-control" placeholder="you@email.com"  onChange={(e) => setemail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" placeholder="Password" onChange={(e) => setpassword(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input type="password" className="form-control" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label">Role</label>
                <select className="form-control" value={role} onChange={e => setRole(e.target.value)}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
              <button type="submit" className="btn btn-dark w-100" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : 'Create Account'}
              </button>
            </form>

          <p className="text-center text-muted mt-3">
            Already have an account? <Link to="/signin" className="text-decoration-none">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
                </>
  );
};

export default Register;
