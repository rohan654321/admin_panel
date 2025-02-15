"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
      const empLeads = allLeads[emp.id] || [];
      setLeads(empLeads);

      // Count leads for the selected date
      const selectedDateStr = selectedDate.toISOString().split("T")[0];
      const leadsCount = empLeads.filter((lead: any) => lead.date === selectedDateStr).length;
      setLeadsToday(leadsCount);
    } catch (error) {
      console.error("Error parsing data:", error);
      router.replace("/employee-login");
    }
  }, [params.id, router, selectedDate]);

  const handleLeadInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewLead({ ...newLead, [e.target.name]: e.target.value });
  };

  const submitLead = () => {
    if (!newLead.name || !newLead.email || !newLead.phone || !newLead.status || !newLead.jobTitle || !newLead.company || !newLead.city || !newLead.message) {
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
    setNewLead({ name: "", email: "", phone: "", status: "", jobTitle: "", company: "", city: "", message: "" });

    // Update today's count
    const today = new Date().toISOString().split("T")[0];
    const leadsTodayCount = updatedLeads.filter((lead: any) => lead.date === today).length;
    setLeadsToday(leadsTodayCount);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInEmployee");
    router.replace("/employee-login");
  };

  // Prepare data for the chart (hourly or daily leads)
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Employee Details</h2>
        <p className="text-slate-800"><strong className="text-black">Name:</strong> {employee?.firstName} {employee?.lastName}</p>
        <p className="text-slate-800"><strong className="text-black">Phone:</strong> {employee?.phone}</p>
        <p className="text-slate-800"><strong className="text-black">Company:</strong> {employee?.department}</p>

        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setIsLeadFormOpen(true)}>
          + Add Lead
        </button>

        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-inner w-full">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 text-center">Leads Count Over Time</h3>
          <div className="flex justify-center mb-4">
            <DatePicker 
              selected={selectedDate} 
              onChange={(date: Date) => setSelectedDate(date)}
              className="border p-2 rounded text-black"
            />
          </div>
          <p className="text-center text-lg font-bold mb-2 text-gray-600">Leads on Selected Date: {leadsToday}</p>
          {leads.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leadsByHour}>
                <XAxis dataKey="hour" tickFormatter={(tick) => `${tick}:00`} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4A90E2" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">No leads available.</p>
          )}
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-black ">Name</th>
                <th className="border px-4 py-2 text-black">Email</th>
                <th className="border px-4 py-2 text-black">Phone</th>
                <th className="border px-4 py-2 text-black">Status</th>
                <th className="border px-4 py-2 text-black">Job Title</th>
                <th className="border px-4 py-2 text-black">Company</th>
                <th className="border px-4 py-2 text-black">City</th>
                <th className="border px-4 py-2 text-black">Message</th>
                <th className="border px-4 py-2 text-black">Date</th>
                <th className="border px-4 py-2 text-black">Time</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, index) => (
                <tr key={index} className="text-center border">
                  <td className="border px-4 py-2 text-black">{lead.name}</td>
                  <td className="border px-4 py-2 text-black">{lead.email}</td>
                  <td className="border px-4 py-2 text-black">{lead.phone}</td>
                  <td className="border px-4 py-2 text-black">{lead.status}</td>
                  <td className="border px-4 py-2 text-black">{lead.jobTitle}</td>
                  <td className="border px-4 py-2 text-black">{lead.company}</td>
                  <td className="border px-4 py-2 text-black">{lead.city}</td>
                  <td className="border px-4 py-2 text-black">{lead.message}</td>
                  <td className="border px-4 py-2 text-black">{lead.date}</td>
                  <td className="border px-4 py-2 text-black">{lead.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <button className="mt-6 bg-red-500 text-white px-4 py-2 rounded" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {isLeadFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Lead</h2>

            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="name" value={newLead.name} onChange={handleLeadInputChange} placeholder="Name" className="border p-2 rounded" />
              <input type="email" name="email" value={newLead.email} onChange={handleLeadInputChange} placeholder="Email" className="border p-2 rounded" />
              <input type="text" name="phone" value={newLead.phone} onChange={handleLeadInputChange} placeholder="Phone" className="border p-2 rounded" />
              <input type="text" name="status" value={newLead.status} onChange={handleLeadInputChange} placeholder="Status" className="border p-2 rounded" />
              <input type="text" name="jobTitle" value={newLead.jobTitle} onChange={handleLeadInputChange} placeholder="Job Title" className="border p-2 rounded" />
              <input type="text" name="company" value={newLead.company} onChange={handleLeadInputChange} placeholder="Company" className="border p-2 rounded" />
              <input type="text" name="city" value={newLead.city} onChange={handleLeadInputChange} placeholder="City" className="border p-2 rounded" />
            </div>

            <textarea name="message" value={newLead.message} onChange={handleLeadInputChange} placeholder="Message" className="border p-2 rounded w-full mt-4"></textarea>

            <div className="flex justify-end mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={() => setIsLeadFormOpen(false)}>Cancel</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={submitLead}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
