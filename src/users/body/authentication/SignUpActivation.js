import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { axiosInstance } from '../../../services/config'


function SignUpActivation() {
  const { activationToken } = useParams()
  const [success, setSuccess] = useState(false)
  useEffect(() => {
    const registerConfirm = async () => {
      try {
        const res = await axiosInstance.post("/api/auth/activation", {
          activationToken: activationToken
        })
        if (res) {
          setSuccess(true)
        }
      } catch (error) {
        setSuccess(false)
        console.log(error.response.data.message)
      }
    }
    if (activationToken) {
      registerConfirm()
    }
  }, [])

  return (
    <section className="bg-image gradient-custom-2 background__color">
      <div className="mask d-flex align-items-center h-100">
        <div className="container vh-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card">
                <div className="bg-white shadow border-0 rounded border-light p-5 w-100  fmxw-500">
                  <h5 className="text-center">  {success ?
                    "Congratulations, you have successfully registered an account 🎉" :
                    "Invalid registration code, cannot activate account 🙁"
                  }
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignUpActivation
