import React from 'react'
import user1 from '../assets/user1.png'
import users from '../assets/users.png'
const WhyChooseUs = () => {
  return (
    <div>
              <div className='p-5' style={{backgroundColor:'#f3f4f6'}}>
            <h2 className='text-center'>Why You Choose Us</h2>
            
            <div className='row justify-content-center px-md-5 mx-5 my-4 gap-2 gap-md-0'>
                <div className='col-md-3 col-sm-6 col-12' style={{width: '18rem'}}>
                    <div className='card border-gray shadow'>
                        <img src={user1} className='card-img-top w-25 mx-auto rounded-pill' height={50}  alt="Feature 1" />
                        <div className='card-body text-center'>
                            <h5 className='card-title'>Alex T., Teacher</h5>
                            <p className='text-gray'>High School
                            </p>
                            <p className='card-text'>“The platform makes sharing lesson notes so much easier! My students always find what they need.”

</p>
                        </div>
                    </div>
                </div>
                <div className='col-md-3 col-sm-6 col-12' style={{width: '18rem'}}>
                    <div className='card border-gray shadow'>
                    <img src={users} className='card-img-top w-25 mx-auto rounded-pill' height={50}  alt="Feature 1" />
                        <div className='card-body text-center'>
                            <h5 className='card-title'>Priya S., Student</h5>
                            <p className='text-gray'>Grade 10</p>
                            <p className='card-text'>"I love how organized everything is. I can review materials any time, even on my phone!”

</p>
                        </div>
                    </div>
                </div>
                <div className='col-md-3 col-sm-6 col-12' style={{width: '18rem'}}>
                    <div className='card border-gray shadow'>
                    <img src={user1} className='card-img-top w-25 mx-auto rounded-pill' height={50}  alt="Feature 1" />
                        <div className='card-body text-center'>
                            <h5 className='card-title'>Ms. Wang, Principal</h5>
                            <p className='text-gray'>School Admin</p>
                            <p className='card-text'>“A secure, reliable solution for our school. We’ve streamlined material distribution for everyone.”

</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}

export default WhyChooseUs