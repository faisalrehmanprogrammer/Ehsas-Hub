import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [value,setValue]=useState({
    email:"",
    password:""

  })
  const handleInput=(e)=>{
    setValue({ ...value,[e.target.name]: e.target.value})
  }
  const navigate=useNavigate()

  const Submit=async(e)=>{
    e.preventDefault()
    const logData={...value}
    try {
      const res=await axios.post("http://localhost:8000/login",logData)

      const token=res.data.token
      localStorage.setItem("authtoken",token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      console.log("register successful",res.data)

      alert('Login Successfully')
      navigate("/")
      setErrorMessage("");
      
    } catch (error) {
      setErrorMessage("Invalid Credential. Please try again!");
      console.log("login here",error.message)

      
    }
    

  }
  return (
    <>
    <div className="signup-container d-flex align-items-center justify-content-center min-vh-100 ">
        <div
          className="card shadow-lg p-4 "
          style={{
            maxWidth: "410px",
            maxheigt: "100%",
            width: "100%",
            borderRadius: "10px",
          }}
        >
          <div className="text-center mb-3 mt-3">
            <div className="text-success ">
              <i class="fa-solid fa-right-to-bracket fa-3x"></i>
            </div>
            <h3 className="text-primary">Login</h3>
            <p className="text-secondary">Join us to get and donate books</p>
          </div>
          {errorMessage && (
            <div className="text-center mb-4">
              <span className="text-danger ">{errorMessage}</span>
            </div>
          )}
          <form onSubmit={Submit}>
            <div className="row">
              <div className="col-12 mb-4">
                <label htmlFor="email" className="text-dark">
                  Email
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="email"
                  placeholder=" Your email"
                  name="email"
                  onChange={handleInput}
                  required
                />
              </div>
            </div>

            <div className="col-md-12 mb-4">
              <label htmlFor="password" className="text-dark">
                Password
              </label>
              <input
                type="password"
                className="form-control rounded-pill"
                id="password"
                placeholder=" Your password"
                required
                name="password"
                onChange={handleInput}
              />
            </div>

            <div className="d-flex justify-content-center mt-5 mb-3">
              <button
                type="submit"
                className="btn btn-primary w-75 mx-auto rounded-pill custom-btn"
                style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default login;