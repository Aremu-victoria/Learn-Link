import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would handle form submission here
    console.log('Form submitted:', formData);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <>
    <Navbar />
      {/* Hero Section */}
      <section className="bg-dark text-white py-5">
        <Container>
          <Row className="py-4">
            <Col lg={8} className="mx-auto text-center">
              <h1 className="display-4 fw-bold">Contact Us</h1>
              <p className="lead">
                Have questions? We're here to help. Get in touch with our team.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Form and Info */}
      <section className="py-5">
        <Container>
          {showAlert && (
            <Alert variant="success" className="mb-4">
              Thank you for your message! We'll get back to you soon.
            </Alert>
          )}
          
          <Row>
            {/* Contact Form */}
            <Col lg={8} className="mb-5">
              <Card className="h-100 shadow-sm">
                <Card.Body className="p-4">
                  <h3 className="mb-4">Send us a Message</h3>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label htmlFor="name">Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your name"
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label htmlFor="email">Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Your email address"
                        />
                      </Col>
                    </Row>
                    <div className="mb-3">
                      <Form.Label htmlFor="subject">Subject</Form.Label>
                      <Form.Control
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="What is this regarding?"
                      />
                    </div>
                    <div className="mb-4">
                      <Form.Label htmlFor="message">Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Your message..."
                      />
                    </div>
                    <Button variant="dark" type="submit" size="lg">
                      Send Message
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Contact Information */}
            <Col lg={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="p-4">
                  <h3 className="mb-4">Contact Information</h3>
                  
                  <div className="d-flex mb-4">
                    <div className="me-3 mt-2 text-primary">
                      <i className="fas fa-map-marker-alt fa-2x"></i>
                    </div>
                    <div>
                      <h5>Address</h5>
                      <p className="text-muted mb-0">
                        123 Education Street<br />
                        Learning City, LN 54321
                      </p>
                    </div>
                  </div>
                  
                  <div className="d-flex mb-4">
                    <div className="me-3 mt-2 text-primary">
                      <i className="fas fa-phone fa-2x"></i>
                    </div>
                    <div>
                      <h5>Phone</h5>
                      <p className="text-muted mb-0">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="d-flex mb-4">
                    <div className="me-3 mt-2 text-primary">
                      <i className="fas fa-envelope fa-2x"></i>
                    </div>
                    <div>
                      <h5>Email</h5>
                      <p className="text-muted mb-0">support@learnlink.com</p>
                    </div>
                  </div>
                  
                  <div className="d-flex">
                    <div className="me-3 mt-2 text-primary">
                      <i className="fas fa-clock fa-2x"></i>
                    </div>
                    <div>
                      <h5>Hours</h5>
                      <p className="text-muted mb-0">
                        Monday-Friday: 9am - 5pm<br />
                        Saturday: 10am - 4pm<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2>Frequently Asked Questions</h2>
              <p className="lead">Find quick answers to common questions</p>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-4">
              <h5>How do I reset my password?</h5>
              <p className="text-muted">
                Click on the "Forgot Password" link on the login page. Enter your email address, and we'll send you instructions to reset your password.
              </p>
            </Col>
            <Col md={6} className="mb-4">
              <h5>Can I access courses on mobile devices?</h5>
              <p className="text-muted">
                Yes! Our platform is fully responsive and works on smartphones, tablets, and desktop computers.
              </p>
            </Col>
            <Col md={6} className="mb-4">
              <h5>How do I enroll in a course?</h5>
              <p className="text-muted">
                Browse our course catalog, select the course you're interested in, and click the "Enroll Now" button.
              </p>
            </Col>
            <Col md={6} className="mb-4">
              <h5>What payment methods do you accept?</h5>
              <p className="text-muted">
                We accept all major credit cards, PayPal, and in some cases, bank transfers.
              </p>
            </Col>
          </Row>
          <Row className="text-center mt-4">
            <Col>
              <Button variant="outline-primary">View All FAQs</Button>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </>
  );
};

export default Contact;