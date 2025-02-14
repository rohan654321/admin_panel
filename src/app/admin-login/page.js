"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    if (form.username === "admin" && form.password === "password") { // ✅ Replace with actual credentials check
      localStorage.setItem("isAuthenticated", "true"); // ✅ Store authentication status
      router.push("/admin-panel"); // ✅ Redirect to Admin Panel
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Login</h1>
      <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} className="border p-2 rounded mb-2 w-64" />
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="border p-2 rounded mb-2 w-64" />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
