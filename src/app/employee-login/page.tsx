"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  department: string;
}

export default function EmployeeLogin() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmployees = JSON.parse(localStorage.getItem("employees") || "[]");
      setEmployees(storedEmployees);
    }
  }, []);

  const handleLogin = () => {
    if (!selectedEmployee) return alert("Please select an employee!");

    localStorage.setItem("loggedInEmployee", selectedEmployee);
    router.push(`/employee/${selectedEmployee}`);

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Employee Login</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <label className="block text-gray-700 text-sm font-bold mb-2">Select Employee</label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Select an Employee --</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.firstName} {emp.lastName} ({emp.department})
            </option>
          ))}
        </select>

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
