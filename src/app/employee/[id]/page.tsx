"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function EmployeeDetails() {
  const params = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsToday, setLeadsToday] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
    jobTitle: "",
    company: "",
    city: "",
    message: "",
  });

  useEffect(() => {
    const storedEmployees = localStorage.getItem("employees");
    const storedLeads = localStorage.getItem("leads");

    if (!storedEmployees) {
      router.replace("/employee-login");
      return;
    }

    try {
      const employees = JSON.parse(storedEmployees);
      const emp = employees.find((e: any) => e.id.toString() === params.id);

      if (!emp) {
        router.replace("/employee-login");
        return;
      }

      setEmployee(emp);

      const allLeads = storedLeads ? JSON.parse(storedLeads) : {};
      const empLeads = Array.isArray(allLeads[emp.id]) ? allLeads[emp.id] : [];

      setLeads(empLeads);

      const selectedDateStr = selectedDate.toISOString().split("T")[0];
      const leadsCount = empLeads.filter(
        (lead: any) => lead.date === selectedDateStr
      ).length;
      setLeadsToday(leadsCount);
    } catch (error) {
      console.error("Error parsing data:", error);
      router.replace("/employee-login");
    }
  }, [params.id, router, selectedDate]);

  const handleLeadInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setNewLead({ ...newLead, [e.target.name]: e.target.value });
  };

  const submitLead = () => {
    // Check if all fields are filled correctly
    if (
      !newLead.name ||
      !newLead.email ||
      !newLead.phone ||
      !newLead.status ||
      !newLead.jobTitle ||
      !newLead.company ||
      !newLead.city ||
      !newLead.message
    ) {
      alert("All fields are required!");
      return;
    }
  
    const now = new Date();
    const newLeadEntry = {
      ...newLead,
      date: now.toISOString().split("T")[0],
      time: now.toISOString().split("T")[1].split(".")[0],
      hour: now.getHours(),
    };
  
    const updatedLeads = [...leads, newLeadEntry];
    setLeads(updatedLeads);
  
    const storedLeads = JSON.parse(localStorage.getItem("leads") || "{}");
    storedLeads[employee.id] = updatedLeads;
    localStorage.setItem("leads", JSON.stringify(storedLeads));
  
    setIsLeadFormOpen(false);
    setNewLead({
      name: "",
      email: "",
      phone: "",
      status: "",
      jobTitle: "",
      company: "",
      city: "",
      message: "",
    });
  
    const today = new Date().toISOString().split("T")[0];
    const leadsTodayCount = updatedLeads.filter(
      (lead: any) => lead.date === today
    ).length;
    setLeadsToday(leadsTodayCount);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInEmployee");
    router.replace("/employee-login");
  };

  const leadsByHour = leads.reduce((acc, lead) => {
    const hour = lead.hour;
    const existing = acc.find((item) => item.hour === hour);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ hour, count: 1 });
    }
    return acc;
  }, [] as { hour: number; count: number }[]);

  return (
    <div className="bg-white flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-200 p-4 flex flex-col justify-between">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
          onClick={() => setIsLeadFormOpen(true)}
        >
          + Add Lead
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Employee Details</h2>
          <p className="text-lg font-bold text-gray-600">Leads Today: {leadsToday}</p>
        </div>
        <p className="text-gray-800">
          <strong>Name:</strong> {employee?.firstName} {employee?.lastName}
        </p>
        <p className="text-gray-800">
          <strong>Phone:</strong> {employee?.phone}
        </p>
        <p className="text-gray-800">
          <strong>Company:</strong> {employee?.department}
        </p>

        {/* Leads Chart */}
        {leads.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart className="min-w-12" data={leadsByHour}>
              <XAxis dataKey="hour" tickFormatter={(tick) => `${tick}:00`} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4A90E2" animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">No leads available.</p>
        )}

        {/* Display Leads */}
        {leads.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-800">Leads</h3>
            <ul className="space-y-4 mt-4 max-h-96 overflow-y-auto">
              {leads.map((lead: any, index) => (
                <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <p className="font-semibold text-gray-800">{lead.name}</p>
                  <p className="text-gray-600">{lead.email}</p>
                  <p className="text-gray-600">{lead.phone}</p>
                  <p className="text-gray-600">{lead.jobTitle}</p>
                  <p className="text-gray-600">{lead.company}</p>
                  <p className="text-gray-600">{lead.city}</p>
                  <p className="text-gray-600">{lead.message}</p>
                  <p className="text-gray-400 text-sm">Lead added on: {lead.date} at {lead.time}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Add Lead Form Modal */}
      {isLeadFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <button
              onClick={() => setIsLeadFormOpen(false)}
              className="text-blue-500 mb-4"
            >
              &larr; Back
            </button>
            <h2 className="text-lg font-bold mb-4">Add New Lead</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full border p-2 mb-2"
              onChange={handleLeadInputChange}
              value={newLead.name}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border p-2 mb-2"
              onChange={handleLeadInputChange}
              value={newLead.email}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              className="w-full border p-2 mb-2"
              onChange={handleLeadInputChange}
              value={newLead.phone}
            />
            <input
              type="text"
              name="status"
              placeholder="Status"
              className="w-full border p-2 mb-2"
              onChange={handleLeadInputChange}
              value={newLead.status}
            />
            <input
              type="text"
              name="jobTitle"
              placeholder="Job Title"
              className="w-full border p-2 mb-2"
              onChange={handleLeadInputChange}
              value={newLead.jobTitle}
            />
            <input
              type="text"
              name="company"
              placeholder="Company"
              className="w-full border p-2 mb-2"
              onChange={handleLeadInputChange}
              value={newLead.company}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              className="w-full border p-2 mb-2"
              onChange={handleLeadInputChange}
              value={newLead.city}
            />
            <textarea
              name="message"
              placeholder="Message"
              className="w-full border p-2 mb-2"
              onChange={handleLeadInputChange}
              value={newLead.message}
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded w-full"
              onClick={submitLead}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
