"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import React from "react";

interface Employee {
  email: ReactNode;
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  department: string;
}

interface Lead {
  name: string;
  email: string;
  phone: string;
  status: string;
  jobTitle: string;
  company: string;
  city: string;
  message: string;
  date: string;
  time: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<(Employee & { leads: Lead[] }) | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email:"",
    phone: "",
    department: "",
  });

  // Ensure this runs only on the client
  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      if (!isAuthenticated) {
        router.push("/admin-login");
      }
      const storedEmployees = JSON.parse(localStorage.getItem("employees") || "[]");
      setEmployees(storedEmployees);
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addEmployee = () => {
    if (!form.firstName || !form.lastName || !form.phone || !form.email || !form.department) {
      return alert("All fields are required!");
    }
  
    const newEmployee: Employee = {
      id: employees.length + 1,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      email: form.email, // ✅ Fix: Assign email properly
      department: form.department,
    };
  
    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
  
    setForm({ firstName: "", lastName: "", email: "", phone: "", department: "" });
  };
  

  const deleteEmployee = (id: number) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== id);
    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
  };

  const viewEmployeeDetails = (employee: Employee) => {
    if (typeof window !== "undefined") {
      const storedLeads: Record<number, Lead[]> = JSON.parse(localStorage.getItem("leads") || "{}");
      const employeeLeads = storedLeads[employee.id] || [];
      setSelectedEmployee({ ...employee, leads: employeeLeads });
      setIsModalOpen(true);
    }
  };

  // Prevent rendering on the server to avoid hydration mismatch
  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Admin Panel</h1>
      <button className="bg-red-500 text-white px-4 py-2 rounded mb-6" onClick={() => {
        localStorage.removeItem("isAuthenticated");
        router.push("/admin-login");
      }}>Logout</button>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="border p-2 rounded" />
        <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded" />
        <input type="text" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
        <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="border p-2 rounded" />
        <select name="department" value={form.department} onChange={handleChange} className="border p-2 rounded">
          <option value="">Select Company</option>
          <option value="IPS">IPS</option>
          <option value="GMEC">GMEC</option>
          <option value="TASCON">TASCON</option>
          <option value="FPS">FPS</option>
        </select>
      </div>

      <button className="bg-green-500 text-white px-4 py-2 rounded mb-6" onClick={addEmployee}>Add Employee</button>

      <div className="overflow-x-auto mt-6">
        <table className="w-full border-collapse border border-gray-300 shadow-md">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Full Name</th>
              <th className="border border-gray-300 px-4 py-2">Phone Number</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Company Name</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="text-center bg-gray-100 border-b border-gray-300">
                <td className="border border-gray-300 px-4 py-2">{emp.id}</td>
                <td className="border border-gray-300 px-4 py-2">{emp.firstName} {emp.lastName}</td>
                <td className="border border-gray-300 px-4 py-2">{emp.phone}</td>
                <td className="border border-gray-300 px-4 py-2">{emp.email}</td>
                <td className="border border-gray-300 px-4 py-2">{emp.department}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => viewEmployeeDetails(emp)}
                  >
                    View
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => deleteEmployee(emp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {isModalOpen && selectedEmployee && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
      <h2 className="text-3xl font-bold mb-4 text-blue-700">
        {selectedEmployee.firstName} {selectedEmployee.lastName}
      </h2>
      <div className="mb-4 space-y-2">
        <p className="text-gray-700"><strong>📞 Phone:</strong> {selectedEmployee.phone}</p>
        <p className="text-gray-700"><strong>🏢 Department:</strong> {selectedEmployee.department}</p>
        <p className="text-gray-700"><strong>📊 Total Leads:</strong> {selectedEmployee.leads.length}</p>
      </div>

      {selectedEmployee.leads.length > 0 ? (
        <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">Lead Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={selectedEmployee.leads.reduce((acc, lead) => {
              let existing = acc.find(item => item.company === lead.company);
              if (existing) {
                existing.count += 1;
              } else {
                acc.push({ company: lead.company, count: 1 });
              }
              return acc;
            }, [] as { company: string; count: number }[])}>
              <XAxis dataKey="company" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4A90E2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-center text-gray-500">No leads available.</p>
      )}

      <div className="flex justify-end mt-6">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          onClick={() => setIsModalOpen(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
  