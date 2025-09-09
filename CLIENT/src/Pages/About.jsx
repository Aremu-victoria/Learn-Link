import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
const AboutUs = () => {
  // Sample team data
  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'Founder & CEO',
      bio: 'Education specialist with 10+ years of experience in curriculum development.',
      image: 'https://placehold.co/300x300/0d6efd/white?text=AJ'
    },
    {
      name: 'Maria Garcia',
      role: 'Head of Learning',
      bio: 'Former university professor passionate about accessible education.',
      image: 'https://placehold.co/300x300/0d6efd/white?text=MG'
    },
    {
      name: 'David Kim',
      role: 'Tech Lead',
      bio: 'Software engineer dedicated to building educational technology.',
      image: 'https://placehold.co/300x300/0d6efd/white?text=DK'
    }
  ];

  // Sample statistics
  const stats = [
    { number: '10,000+', label: 'Active Learners' },
    { number: '200+', label: 'Courses' },
    { number: '50+', label: 'Expert Instructors' },
    { number: '95%', label: 'Satisfaction Rate' }
  ];

  // Sample testimonials
  const testimonials = [
    {
      text: 'This platform transformed my learning experience. The courses are well-structured and engaging.',
      author: 'Sarah T., Student'
    },
    {
      text: 'As an educator, I appreciate the quality of content and the support for teachers.',
      author: 'Michael L., Teacher'
    }
  ];

  return (
    <>
      {/* Navigation */}
<Navbar />

      {/* Hero Section */}
      <section className="bg-dark text-white py-5">
        <Container>
          <Row className="py-5">
            <Col lg={8} className="mx-auto text-center">
              <h1 className="display-4 fw-bold">About LearnLink</h1>
              <p className="lead">
                We're revolutionizing education through technology, making quality learning accessible to everyone, everywhere.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h2>Our Mission</h2>
              <p className="lead">
                To democratize education by providing high-quality, affordable learning opportunities to students worldwide.
              </p>
              <p>
                Founded in 2020, LearnLink emerged from a simple observation: quality education should not be a privilege 
                but a fundamental right. We've built a platform that connects learners with expert educators, creating 
                meaningful learning experiences that translate to real-world skills.
              </p>
              <Button variant="dark">Learn More About Our Story</Button>
            </Col>
            <Col md={6}>
              <img 
                src="https://placehold.co/600x400/eee/999?text=Learning+Community" 
                alt="Students learning together" 
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center">
            {stats.map((stat, index) => (
              <Col md={3} sm={6} key={index} className="mb-4 mb-md-0">
                <div className="display-4 fw-bold text-dark">{stat.number}</div>
                <p>{stat.label}</p>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Team Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2>Meet Our Team</h2>
              <p className="lead">Passionate educators and innovators driving our mission forward</p>
            </Col>
          </Row>
          <Row>
            {teamMembers.map((member, index) => (
              <Col md={4} key={index} className="mb-4">
                <Card className="h-100 border-0 shadow">
                  <Card.Img variant="top" src={member.image} />
                  <Card.Body className="text-center">
                    <Card.Title>{member.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{member.role}</Card.Subtitle>
                    <Card.Text>{member.bio}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2>What Our Community Says</h2>
            </Col>
          </Row>
          <Row>
            {testimonials.map((testimonial, index) => (
              <Col md={6} key={index} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <blockquote className="blockquote mb-0">
                      <p>"{testimonial.text}"</p>
                      <footer className="blockquote-footer mt-3">{testimonial.author}</footer>
                    </blockquote>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      {/* Footer */}
    <Footer />
    </>
  );
};

export default AboutUs;