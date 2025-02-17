"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
}

export default function EmployeeLogin() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmployees = JSON.parse(localStorage.getItem("employees") || "[]");
      setEmployees(storedEmployees);
    }
  }, []);

  const handleLogin = () => {
    if (!email || !password) return alert("Please enter email and password!");

    const employee = employees.find((emp) => emp.email === email);

    if (!employee) {
      return alert("Employee not found! Please check your email.");
    }

    if (password !== "123456") {
      return alert("Incorrect password! Default password is 123456.");
    }

    localStorage.setItem("currentEmployee", JSON.stringify(employee));
    router.push(`/employee/${employee.id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Employee Login</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full border p-2 rounded text-black"
        />

        <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full border p-2 rounded text-black"
        />

        <button
          className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
