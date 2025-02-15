"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);// State for date selection
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]); 

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
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
    if (!form.firstName || !form.lastName || !form.phone || !form.email || !form.department ) {
      return alert("All fields are required, including the Joining Date!");
    }

    const newEmployee: Employee = {
      id: employees.length + 1,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      email: form.email,
      department: form.department, 
    };

    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));

    setForm({ firstName: "", lastName: "", email: "", phone: "", department: "" });
    setSelectedDate(null); // Reset the date picker
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
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  
    if (selectedEmployee) {
      if (date) {
        const selectedDateString = date.toISOString().split("T")[0];
  
        const filtered = selectedEmployee.leads.filter((lead) => {
          const leadDateString = new Date(lead.date).toISOString().split("T")[0];
          return leadDateString === selectedDateString;
        });
  
        setFilteredLeads(filtered);
      } else {
        setFilteredLeads(selectedEmployee.leads);
      }
    }
  };
  
  const getLeadsPerDay = () => {
    if (!filteredLeads.length) return [];
  
    const counts: Record<string, number> = {};
  
    filteredLeads.forEach((lead) => {
      const leadDateString = new Date(lead.date).toISOString().split("T")[0];
      counts[leadDateString] = (counts[leadDateString] || 0) + 1;
    });
  
    return Object.entries(counts).map(([date, count]) => ({
      date,
      count,
    }));
  };
  
  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Admin Panel</h1>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded mb-6"
        onClick={() => {
          localStorage.removeItem("isAuthenticated");
          router.push("/admin-login");
        }}
      >
        Logout
      </button>

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

      <button className="bg-green-500 text-white px-4 py-2 rounded mb-6" onClick={addEmployee}>
        Add Employee
      </button>

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
                  <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => deleteEmployee(emp.id)}>
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
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full h-[80vh] overflow-y-auto">
      <h2 className="text-3xl font-bold mb-4 text-blue-700">
        {selectedEmployee.firstName} {selectedEmployee.lastName}
      </h2>
      <div className="mb-4 space-y-2">
        <p className="text-gray-700"><strong>📞 Phone:</strong> {selectedEmployee.phone}</p>
        <p className="text-gray-700 flex items-center">
    <strong>📧 Email: </strong> {selectedEmployee.email}
  </p>
        <p className="text-gray-700"><strong>🏢 Department:</strong> {selectedEmployee.department}</p>
        <p className="text-gray-700"><strong>📊 Total Leads:</strong> {selectedEmployee.leads.length}</p>
      </div>

      {/* Date Picker */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Select Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Leads Table with Scroll */}
      <div className="overflow-y-auto max-h-[300px] border border-gray-300 rounded-lg shadow-inner">
        {filteredLeads.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-500 text-white">
              <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Company</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Phone</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead, index) => (
                <tr key={index} className="text-center bg-gray-100 border-b border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">{lead.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{lead.company}</td>
                  <td className="border border-gray-300 px-4 py-2">{lead.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{lead.phone}</td>
                  <td className="border border-gray-300 px-4 py-2">{lead.status}</td>
                  <td className="border border-gray-300 px-4 py-2">{lead.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 p-4">No leads available for selected date.</p>
        )}
      </div>

      {/* Lead Chart */}
      {filteredLeads.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-inner mt-6">
          <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">Lead Count Per Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getLeadsPerDay()}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4A90E2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
