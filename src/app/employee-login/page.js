"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ id: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    const storedEmployees = JSON.parse(localStorage.getItem("employees")) || [];
    const employee = storedEmployees.find(emp => emp.id.toString() === form.id);

    if (!employee) {
      alert("Employee not found!");
      return;
    }

    if (form.password !== "1234") { 
      alert("Incorrect password!");
      return;
    }

    router.push(`/employee/${form.id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Employee Login</h1>
      
      <input
        type="text"
        name="id"
        value={form.id}
        onChange={handleChange}
        placeholder="Employee ID"
        className="border p-2 rounded mb-2 w-64 text-black"
      />
      
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        className="border p-2 rounded mb-2 w-64 text-black"
      />
      
      <button
        onClick={handleLogin}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </button>
    </div>
  );
}
