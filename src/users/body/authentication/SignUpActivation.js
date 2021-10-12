import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'


function SignUpActivation() {
    const { activationToken } = useParams()
    console.log(activationToken)
    const [success, setSuccess] = useState(false)
    useEffect(() => {
        const registerConfirm = async () => {
            var postForm = new FormData()
            postForm.append("activationToken", activationToken)

            try {
                const res = await axios.post("http://localhost:8080/api/auth/activation", {
                    activationToken: activationToken
                })
                if (res) {
                    setSuccess(true)
                }
            } catch (error) {
                setSuccess(false)
            }
        }
        if (activationToken) {
            registerConfirm()
        }
    }, [])

    return (
        <main className="main__auth">
            <div className="register">
                <h3 style={{ color: "var(--color-primary)" }}>
                    {success ? "Chúc mừng bạn đã đăng ký tài khoản thành công 🎉" :
                        "Mã đăng ký không hợp lệ, không thể kích hoạt tài khoản 🙁"
                    }
                </h3>
            </div>
        </main>
    )
}

export default SignUpActivation
