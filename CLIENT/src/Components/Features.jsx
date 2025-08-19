import React from 'react'
import { FaUpload } from "react-icons/fa";
import { GiCloudDownload } from "react-icons/gi";
import { FaRegClock } from "react-icons/fa";
import { IoLogoBuffer } from "react-icons/io5";
const Features = () => {
  return (
    <div>
        <div className=''>
            <h2 className='text-center'>Features</h2>
            
            <div className='row justify-content-center px-md-5 mx-5 my-4 gap-2 gap-md-0'>
                <div className='col-md-3 col-sm-6 col-12'>
                    <div className='card' style={{backgroundColor:'#f9fafb'}}>
                        <p className='rounded-pill text-white text-center mx-auto my-2 p-1' style={{backgroundColor:'black',width:'40px', height:'40px' }}>
                                <FaUpload />
                        </p>
                        <div className='card-body text-center'>
                            
                            <p className='card-text'>Upload Notes
                            </p>
                            <p className='card-text'>Teachers and students can easily upload PDF, DOCX, and more.
                            </p>
                        </div>
                    </div>
                </div>
                <div className='col-md-3 col-sm-6 col-12'>
                    <div className='card' style={{backgroundColor:'#f9fafb'}}>
                    <p className='rounded-pill text-white text-center mx-auto my-2 p-1' style={{backgroundColor:'black',width:'40px', height:'40px' }}>
                                <FaRegClock />
                        </p>
                        <div className='card-body text-center'>
                            <p className='card-text'>Access Anytime
                            </p>
                            <p className='card-text'>Materials are available 24/7, from any device.
                            </p>
                        </div>
                    </div>
                </div>
                <div className='col-md-3 col-sm-6 col-12'>
                    <div className='card' style={{backgroundColor:'#f9fafb'}}>
                    <p className='rounded-pill text-white text-center mx-auto my-2 p-1' style={{backgroundColor:'black',width:'40px', height:'40px' }}>
                                <IoLogoBuffer />
                        </p>
                        <div className='card-body text-center'>
                            <p className='card-text'>Organize Materials</p>
                            <p className='card-text'>DCategorize by subject, class, or resource type for easy retrieval.
                            </p>
                        </div>
                    </div>
                </div>
                <div className='col-md-3 col-sm-6 col-12'>
                    <div className='card' style={{backgroundColor:'#f9fafb'}}>
                    <p className='rounded-pill text-white text-center mx-auto my-2 p-1' style={{backgroundColor:'black',width:'40px', height:'40px' }}>
                                <GiCloudDownload />
                        </p>
                        <div className='card-body text-center'>
                            <p className='card-text'>Secure Cloud Storage
                            </p>
                            <p className='card-text'>All files are safely stored and encrypted in the cloud.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
  )
}

export default Features