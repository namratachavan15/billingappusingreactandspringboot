import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterShop = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    mobile: "",
    email: "",
    password: "", // password for the owner user
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5454/api/auth/register-shop",
        {
          shopName: form.shopName,
          ownerName: form.ownerName,
          mobile: form.mobile,
          email: form.email,
        },
        {
          params: { password: form.password },
        }
      );
      alert("Shop and owner registered successfully");
      navigate("/login");
    } catch (err) {
      alert("Error: " + err.response?.data || err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Register Shop</h3>
      <form onSubmit={submit}>
        <input
          className="form-control mb-2"
          placeholder="Shop Name"
          onChange={(e) => setForm({ ...form, shopName: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="Owner Name"
          onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="Mobile"
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
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

export default RegisterShop;
