import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "OWNER",
  });

  const submit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5454/api/auth/register", form);
    alert("Registered successfully");
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <h3>Register</h3>
      <form onSubmit={submit}>
        <input
          className="form-control mb-2"
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn btn-success w-100">Register</button>
      </form>
    </div>
  );
};

export default Register;
