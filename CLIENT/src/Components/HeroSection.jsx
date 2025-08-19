import React from 'react'
import heroGif from '../assets/Webinar.gif'
import { Link } from 'react-router-dom'
const HeroSection = () => {
    return (
        <div className='d-md-flex p-sm-5 justify-content-between px-5 align-items-center'>
            <div className='text-center text-md-start '>
                <h1 className='fs-1 fw-thin'>Empowering Schools With Seamless Material  Uploading</h1>
                <p className='text-sm pt-2'>A unified A unified, secure platform for teachers and students to <br /> upload, organize, and access educational resources— <br />It won't make sense. anytime, anywhere.

                </p>
                <div className='d-flex justify-content-center justify-content-md-start gap-3 pt-3'>
                    <Link to='/signup' className='px-3 py-2 rounded text-white border-0' style={{ backgroundColor: "#374151", textDecoration: 'none' }}>Get Started</Link>
                    <button className='bg-light border-1 border-gray px-3 py-2 rounded text-black'>Learn More</button>
                </div>
            </div>
            <div className=' justify-content-center align-items-center'>
                <img src={heroGif} alt="" className='w-100' />
            </div>
        </div>
    )
}

export default HeroSection