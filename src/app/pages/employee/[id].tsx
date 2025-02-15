"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
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

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  department: string;
}

export default function EmployeeDetails() {
  const router = useRouter();
  const { id } = useParams(); // ✅ Correct way to access route params

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (id && typeof window !== "undefined") {
      const storedEmployees = JSON.parse(localStorage.getItem("employees") || "[]");
      const storedLeads = JSON.parse(localStorage.getItem("leads") || "{}");

      const foundEmployee = storedEmployees.find((emp: Employee) => emp.id === parseInt(id as string));
      const employeeLeads = storedLeads[id as keyof typeof storedLeads] || [];


      if (foundEmployee) {
        setEmployee(foundEmployee);
        setLeads(employeeLeads);
        setFilteredLeads(employeeLeads); // Initially, show all leads
      }
    }
  }, [id]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);

    if (date) {
      const selectedDateString = date.toISOString().split("T")[0];
      const filtered = leads.filter((lead) => {
        const leadDateString = new Date(lead.date).toISOString().split("T")[0];
        return leadDateString === selectedDateString;
      });

      setFilteredLeads(filtered);
    } else {
      setFilteredLeads(leads);
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

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Employee Details</h1>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded mb-6"
        onClick={() => router.push("/admin-panel")}
      >
        Back to Admin Panel
      </button>

      <div className="mb-4 space-y-2">
        <p><strong>📞 Phone:</strong> {employee.phone}</p>
        <p><strong>📧 Email:</strong> {employee.email}</p>
        <p><strong>🏢 Department:</strong> {employee.department}</p>
        <p><strong>📊 Total Leads:</strong> {leads.length}</p>
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

      {/* Leads Table */}
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
    </div>
  );
}
