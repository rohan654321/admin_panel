"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPanel() {
  const router = useRouter();
  const [employees, setEmployees] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    department: "",
  });

  // ✅ Check if the user is logged in
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/admin-login"); // Redirect to login if not authenticated
    }

    const storedEmployees = JSON.parse(localStorage.getItem("employees")) || [];
    setEmployees(storedEmployees);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addEmployee = () => {
    if (!form.firstName || !form.lastName || !form.phone || !form.department)
      return alert("All fields are required!");

    const newEmployee = {
      id: employees.length + 1,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      department: form.department,
    };

    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));

    setForm({ firstName: "", lastName: "", phone: "", department: "" });
  };

  const deleteEmployee = (id) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== id);
    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));

    const storedLeads = JSON.parse(localStorage.getItem("leads")) || {};
    delete storedLeads[id];
    localStorage.setItem("leads", JSON.stringify(storedLeads));
  };

  if (employees === null) return <p className="text-red-500">Loading...</p>;

  return (
    <div className="p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Admin Panel</h1>

      <button className="bg-red-500 text-white px-4 py-2 rounded mb-4" onClick={() => {
        localStorage.removeItem("isAuthenticated"); // ✅ Logout
        router.push("/admin-login");
      }}>
        Logout
      </button>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="border p-2 rounded" />
        <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded" />
        <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="border p-2 rounded" />
        <select name="department" value={form.department} onChange={handleChange} className="border p-2 rounded">
          <option value="">Select Company</option>
          <option value="HR">IPS</option>
          <option value="Sales">GMEC</option>
          <option value="IT">TASCON</option>
          <option value="Finance">FPS</option>
        </select>
      </div>

      <button className="bg-green-500 text-white px-4 py-2 rounded mb-4" onClick={addEmployee}>
        Add Employee
      </button>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-purple-700">ID</th>
            <th className="border p-2 text-purple-700">Full Name</th>
            <th className="border p-2 text-purple-700">Phone</th>
            <th className="border p-2 text-purple-700">Department</th>
            <th className="border p-2 text-purple-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border">
              <th className="border p-2 text-white">{emp.id}</th>
              <th className="border p-2 text-white">{emp.firstName} {emp.lastName}</th>
              <th className="border p-2 text-white">{emp.phone}</th>
              <th className="border p-2 text-white">{emp.department}</th>
              <th className="border p-2 flex gap-2">
                <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => deleteEmployee(emp.id)}>
                  Delete
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
