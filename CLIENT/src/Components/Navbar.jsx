import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
       <nav className="navbar navbar-expand-lg bg-body-tertiary ps-3 pe-3 fixed top-0">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">LearnLink</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">About</a>
        </li>
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">Feature</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">contact</a>
        </li>
      </ul>
      <form className="d-flex" role="search">
        {/* <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/> */}
       <Link to='/signin' className='' style={{textDecoration:'none'}}> <button className="rounded text-white border-0 py-2 px-3" style={{backgroundColor:"#374151"}}  type="submit">Sign in</button></Link>
      </form>
    </div>
  </div>
</nav> 
    </>
  )
}

export default Navbar