"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function EmployeeDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [leads, setLeads] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [chartData, setChartData] = useState([]); // Fix for hydration issue
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

  const [editIndex, setEditIndex] = useState(null); // Track the lead being edited

  useEffect(() => {
    setIsClient(true); // Ensures safe rendering
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedEmployees = JSON.parse(localStorage.getItem("employees")) || [];
      const emp = storedEmployees.find((emp) => emp.id.toString() === id);
      
      if (emp) {
        setEmployee(emp);
      } else {
        console.error("Employee not found in localStorage");
      }
  
      const storedLeads = JSON.parse(localStorage.getItem("leads")) || {};
      const employeeLeads = storedLeads[id] || [];
      setLeads(employeeLeads);
  
      const updatedChartData = employeeLeads.map((lead, index) => ({
        name: `Lead ${index + 1}`,
        leadCount: index + 1
      }));
      setChartData(updatedChartData);
    }
  }, [id, isClient]);
  

  const handleInputChange = (e) => {
    setNewLead({ ...newLead, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateLead = (e) => {
    e.preventDefault();
    
    const dateTime = new Date();
    const formattedDate = dateTime.toLocaleDateString();
    const formattedTime = dateTime.toLocaleTimeString();

    const leadWithDateTime = { 
      ...newLead, 
      date: formattedDate, 
      time: formattedTime 
    };

    let updatedLeads;
    
    if (editIndex !== null) {
      updatedLeads = leads.map((lead, index) =>
        index === editIndex ? leadWithDateTime : lead
      );
      setEditIndex(null);
    } else {
      updatedLeads = [...leads, leadWithDateTime];
    }

    setLeads(updatedLeads);
    const storedLeads = JSON.parse(localStorage.getItem("leads")) || {};
    storedLeads[id] = updatedLeads;
    localStorage.setItem("leads", JSON.stringify(storedLeads));

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

  const handleDeleteLead = (index) => {
    const updatedLeads = leads.filter((_, i) => i !== index);
    setLeads(updatedLeads);
    const storedLeads = JSON.parse(localStorage.getItem("leads")) || {};
    storedLeads[id] = updatedLeads;
    localStorage.setItem("leads", JSON.stringify(storedLeads));
  };

  const handleEditLead = (index) => {
    setNewLead(leads[index]);
    setEditIndex(index);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/employee-login"; // Ensures full reload and redirection
  };
  

  if (!isClient) {
    return <div>Loading...</div>;
  }

  if (!employee) {
    return <h1 className="text-center text-xl mt-10">Employee not found.</h1>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header with Avatar & Logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employee Details</h1>
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <img 
            src={employee.avatar || "https://via.placeholder.com/50"} 
            alt="Employee Avatar"
            className="w-12 h-12 rounded-full border shadow-md"
          />
          {/* Logout Button */}
          <button 
            onClick={handleLogout} 
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
      {!employee ? (
  <h1 className="text-center text-xl mt-10">Employee not found. Please check localStorage.</h1>
) : (
  <>
    <p className="text-lg text-gray-700">ID: {employee.id}</p>
    <p className="text-lg text-gray-700">Name: {employee.name}</p>
    <p className="text-lg text-gray-700">Department: {employee.department}</p>
  </>
)}

      <h2 className="mt-6 text-xl font-bold text-neutral-600">Leads ({leads.length})</h2>
            {/* Lead Chart */}
            <h2 className="mt-6 text-xl font-bold text-blue-600">Leads Growth</h2>
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" label={{ value: "Leads", position: "insideBottom", dy: 10 }} />
            <YAxis label={{ value: "Lead Count", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Bar dataKey="leadCount" fill="#82ca9d" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Leads Table */}
    {/* Leads Table */}
      {/* Add or Update Lead Form */}
      <h2 className="mt-6 text-xl font-bold text-teal-300">
        {editIndex !== null ? "Update Lead" : "Add New Lead"}
      </h2>
      <form className="bg-white p-4 mt-4 rounded-lg shadow-md" onSubmit={handleAddOrUpdateLead}>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="name" value={newLead.name} onChange={handleInputChange} placeholder="Name" className="border p-2 rounded text-black" required />
          <input type="email" name="email" value={newLead.email} onChange={handleInputChange} placeholder="Email" className="border p-2 rounded text-black" required />
          <input type="tel" name="phone" value={newLead.phone} onChange={handleInputChange} placeholder="Phone" className="border p-2 rounded text-black" required />
          <input type="text" name="status" value={newLead.status} onChange={handleInputChange} placeholder="Status" className="border p-2 rounded text-black" />
          <input type="text" name="jobTitle" value={newLead.jobTitle} onChange={handleInputChange} placeholder="Job Title" className="border p-2 rounded text-black" />
          <input type="text" name="company" value={newLead.company} onChange={handleInputChange} placeholder="Company" className="border p-2 rounded text-black" />
          <input type="text" name="city" value={newLead.city} onChange={handleInputChange} placeholder="City" className="border p-2 rounded text-black" />
          <textarea name="message" value={newLead.message} onChange={handleInputChange} placeholder="Message" className="border p-2 rounded col-span-2 text-black" />
        </div>

        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 w-full">
          {editIndex !== null ? "Update Lead" : "Submit Lead"}
        </button>
      </form>
      <div className="overflow-x-auto mt-4">
      <h2 className="mt-6 text-xl font-bold text-teal-300 m-1">Leads List</h2>
  <table className="w-full bg-white border rounded-lg shadow-md">
    <thead className="bg-gray-200">
      <tr>
        <th className="p-2 border text-black">Name</th>
        <th className="p-2 border text-black">Email</th>
        <th className="p-2 border text-black">Phone</th>
        <th className="p-2 border text-black">Company</th>
        <th className="p-2 border text-black">City</th>
        <th className="p-2 border text-black">Status</th>
        <th className="p-2 border text-black">Message</th>
        <th className="p-2 border text-black">Date</th> {/* New Column */}
        <th className="p-2 border text-black">Time</th> {/* New Column */}
        <th className="p-2 border text-black">Actions</th>
      </tr>
    </thead>
    <tbody>
  {leads.length === 0 ? (
    <tr>
      <td colSpan="10" className="p-4 text-center">No leads available.</td>
    </tr>
  ) : (
    leads.map((lead, index) => (
      <tr key={index} className="text-center">
        <td className="p-2 border text-black">{lead.name}</td>
        <td className="p-2 border text-black">{lead.email}</td>
        <td className="p-2 border text-black">{lead.phone}</td>
        <td className="p-2 border text-black">{lead.company}</td>
        <td className="p-2 border text-black">{lead.city}</td>
        <td className="p-2 border text-black">{lead.status}</td>
        <td className="p-2 border text-black">{lead.message}</td> 
        <td className="p-2 border text-black">{lead.date}</td>
        <td className="p-2 border text-black">{lead.time}</td>
        <td className="p-2 border flex justify-center space-x-2">
          <button
            onClick={() => handleEditLead(index)}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded-lg shadow-md transition duration-300"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => handleDeleteLead(index)}
            className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded-lg shadow-md transition duration-300"
          >
            🗑️ Delete
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
  </table>
</div>
</div>
  );
}
