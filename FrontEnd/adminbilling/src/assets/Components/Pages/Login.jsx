import { useState } from "react";
import { useAuth } from "../States/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
    
    >
      <div
        className="card p-4 shadow-lg"
        style={{ width: "350px", borderRadius: "15px", backgroundColor: "#f8f9fa" }}
      >
        <div className="text-center mb-4">
          <h3 className="fw-bold" style={{ color: "#000DFF" }}>Login</h3>
          <p className="text-muted">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              className="form-control py-2"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control py-2"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ borderRadius: "10px" }}
            />
          </div>

          <button
            className="btn w-100 text-white fw-bold"
            type="submit"
            style={{
              background: "linear-gradient(90deg, #6B73FF 0%, #000DFF 100%)",
              borderRadius: "10px",
              padding: "8px",
            }}
          >
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Forgot password? <a href="#" style={{ color: "#000DFF" }}>Reset</a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
