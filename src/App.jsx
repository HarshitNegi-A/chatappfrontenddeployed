import { useState } from 'react'
import './App.css'

function App() {
  const [login, setLogin] = useState(false)

  const handleLogin=()=>{
    setLogin(!login)
  }

  return (
    <>
      <form>
        <h1>{login?"Login":"Signup"}</h1>
        {!login && <><label htmlFor='name'>Name</label>
        <input id='name' type='text' /></>}
        <label htmlFor='email'>Email</label>
        <input id='email' type='email' />
        <label htmlFor='phno'>Phone Number</label>
        <input id='phno' type='number' />
        <label htmlFor='pass'>Password</label>
        <input id='pass' type='password' />
      </form>
      <button onClick={handleLogin}>Already have a account? LogIn</button>
    </>
  )
}

export default App
