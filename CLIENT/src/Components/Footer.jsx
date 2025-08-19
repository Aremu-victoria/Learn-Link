import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row justify-content-between align-items-start">
 
          <div className="col-md-8 mb-4 mb-md-0">
            <h5>Learn Link</h5>
            <p className="mb-0">© 2025 School. All rights reserved.</p>
          </div>

        
        
          <div className="col-md-4">
            <div className="d-md-flex gap-5">
              <div className="">
                <ul className="list-unstyled">
                  <li><a href="#" className="text-light text-decoration-none">About</a></li>
                  <li><a href="#" className="text-light text-decoration-none">Contact</a></li>
                  <li><a href="#" className="text-light text-decoration-none">Privacy Policy</a></li>
                  <li><a href="#" className="text-light text-decoration-none">Terms of Service</a></li>
                </ul>
              </div>

              <div className="col-6 d-flex gap-3 pt-5 ">
                <a href="#" className="text-light"><i className="bi bi-facebook"></i></a>
                <a href="#" className="text-light"><i className="bi bi-twitter"></i></a>
                <a href="#" className="text-light"><i className="bi bi-instagram"></i></a>
                <a href="#" className="text-light"><i className="bi bi-linkedin"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
