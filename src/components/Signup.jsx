import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom";


const SignUp = () => {
  const [login, setLogin] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phno: '',
    pass: ''
  })
  const navigate = useNavigate()
  let url = "https://api.myexpensetracker.info";

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }
  console.log(formData)
  const handleLogin = () => {
    setLogin(!login)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!login) {
        const res = await axios.post(`${url}signup`, formData, {
          headers: { "Content-Type": "application/json" }
        })
        localStorage.setItem("token", res.data.token)
        alert(res.data.message)
        navigate('/chat')
      } else {
        const res = await axios.post(`${url}login`, formData, {
          headers: { "Content-Type": "application/json" }
        })
        localStorage.setItem("token", res.data.token)
        alert(res.data.message)
        navigate('/chat')
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Something went wrong")
      } else {
        alert("Network error, please try again")
      }
      console.error("Error:", error)
    }
  }


  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <h1>{login ? "Login" : "Signup"}</h1>
        {!login && <><label htmlFor='name'>Name</label>
          <input id='name' type='text' value={formData.name} onChange={handleChange} /></>}
        {!login && <><label htmlFor='email'>Email</label>
          <input id='email' type='email' value={formData.email} onChange={handleChange} /></>}
        <label htmlFor='phno'>Phone Number</label>
        <input id='phno' type='number' value={formData.phno} onChange={handleChange} />
        <label htmlFor='pass'>Password</label>
        <input id='pass' type='password' value={formData.pass} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      <button type="click" onClick={handleLogin}>{login ? "New here?SignUp" : "Already have a account?LogIn"}</button>
    </>
  )
}

export default SignUp;