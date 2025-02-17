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
import { CircularProgressbar } from "react-circular-progressbar"; 
import "react-circular-progressbar/dist/styles.css";

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
  const [totalLeads, setTotalLeads] = useState(0);
  const [animatedLeadCount, setAnimatedLeadCount] = useState(0);

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
      setTotalLeads(empLeads.length);

      // Animation logic for animated progress
      const interval = setInterval(() => {
        if (animatedLeadCount < empLeads.length) {
          setAnimatedLeadCount((prev) => prev + 1);
        }
      }, 50); // Animate by 1 count every 50ms

      // Clear interval when count reaches the total leads
      if (animatedLeadCount >= empLeads.length) {
        clearInterval(interval);
      }

      return () => clearInterval(interval); // Clean up the interval on component unmount
    } catch (error) {
      console.error("Error parsing data:", error);
      router.replace("/employee-login");
    }
  }, [params.id, router, animatedLeadCount]);

  useEffect(() => {
    // Calculate today's date in the format yyyy-mm-dd
    const today = new Date().toISOString().split("T")[0];

    // Filter leads for today
    const leadsTodayCount = leads.filter((lead: any) => lead.date === today).length;
    setLeadsToday(leadsTodayCount);
  }, [leads]);

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
      date: now.toISOString().split("T")[0], // Store date as yyyy-mm-dd
      time: now.toISOString().split("T")[1].split(".")[0], // Store time as hh:mm:ss
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
          <div className="flex items-center">
            <img
              src={employee?.avatar || "/default-avatar.png"}
              alt="Employee Avatar"
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <h2 className="text-2xl font-bold text-gray-800">{employee?.firstName} {employee?.lastName}</h2>
          </div>
          <p className="text-lg font-bold text-gray-600">Leads Today: {leadsToday}</p>
          <div className="w-24 h-24">
            <CircularProgressbar
              value={(animatedLeadCount / totalLeads) * 100}
              text={`${animatedLeadCount}`}
              strokeWidth={10}
              styles={{
                path: { stroke: "#4A90E2" },
                text: { fill: "#4A90E2", fontSize: "24px" },
                trail: { stroke: "#e5e5e5" },
              }}
            />
          </div>
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
                  <p className="text-gray-600">{lead.status}</p>
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-2xl font-bold mb-4">Add Lead</h3>
            <form>
              <input
                className="mb-2 p-2 w-full border rounded"
                type="text"
                placeholder="Name"
                name="name"
                value={newLead.name}
                onChange={handleLeadInputChange}
              />
              <input
                className="mb-2 p-2 w-full border rounded"
                type="email"
                placeholder="Email"
                name="email"
                value={newLead.email}
                onChange={handleLeadInputChange}
              />
              <input
                className="mb-2 p-2 w-full border rounded"
                type="text"
                placeholder="Phone"
                name="phone"
                value={newLead.phone}
                onChange={handleLeadInputChange}
              />
              <input
                className="mb-2 p-2 w-full border rounded"
                type="text"
                placeholder="Job Title"
                name="jobTitle"
                value={newLead.jobTitle}
                onChange={handleLeadInputChange}
              />
                            <input
                className="mb-2 p-2 w-full border rounded"
                type="text"
                placeholder="status"
                name="status"
                value={newLead.status}
                onChange={handleLeadInputChange}
              />
              <input
                className="mb-2 p-2 w-full border rounded"
                type="text"
                placeholder="Company"
                name="company"
                value={newLead.company}
                onChange={handleLeadInputChange}
              />
              <input
                className="mb-2 p-2 w-full border rounded"
                type="text"
                placeholder="City"
                name="city"
                value={newLead.city}
                onChange={handleLeadInputChange}
              />
              <textarea
                className="mb-2 p-2 w-full border rounded"
                placeholder="Message"
                name="message"
                value={newLead.message}
                onChange={handleLeadInputChange}
              />
              <button
                type="button"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded"
                onClick={submitLead}
              >
                Submit Lead
              </button>
            </form>
            <button
              className="w-full mt-4 bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setIsLeadFormOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
