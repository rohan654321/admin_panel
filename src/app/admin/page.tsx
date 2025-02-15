"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Employee {
  email: ReactNode;
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  department: string;
}

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
  });
  

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      if (!isAuthenticated) {
        router.push("/admin-login");
      }
  
      // Fetch employees from localStorage
      const storedEmployees = JSON.parse(localStorage.getItem("employees") || "[]");
      setEmployees(storedEmployees);
  
      // Fetch leads from localStorage
      let storedLeads = JSON.parse(localStorage.getItem("leads") || "[]");
  
      // Ensure storedLeads is an array
      if (!Array.isArray(storedLeads)) {
        storedLeads = [];
      }
  
      // Generate leads from employees if not available
      if (storedLeads.length === 0 && Array.isArray(storedEmployees)) {
        storedLeads = storedEmployees.map((emp) => ({
          id: emp.id,
          name: `${emp.firstName} ${emp.lastName}`,
          email: emp.email,
          phone: emp.phone,
          company: emp.department,
        }));
        localStorage.setItem("leads", JSON.stringify(storedLeads));
      }
  
      setLeads(storedLeads);
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
      email: form.email,
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
    router.push(`/employee/${employee.id}`);
  };

  if (!isClient) {
    return <div className="text-center text-gray-700 text-lg">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-blue-900 text-white p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <button className={`py-2 px-4 mb-2 rounded ${activeTab === "dashboard" ? "underline" : ""}`} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
        <button className={`py-2 px-4 mb-2 rounded ${activeTab === "leads" ? "underline" : ""}`} onClick={() => setActiveTab("leads")}>Leads</button>
        <button className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded" onClick={() => { localStorage.removeItem("isAuthenticated"); router.push("/admin-login"); }}>Logout</button>
      </aside>

      <div className="flex-1 p-8">
        {activeTab === "dashboard" && (
          <>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
            <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-md mb-6">
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="border p-2 rounded text-gray-800" />
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded text-gray-800" />
              <input type="text" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded text-gray-800" />
              <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="border p-2 rounded text-gray-800" />
              <select  name="department" value={form.department} onChange={handleChange} className="border p-2 rounded text-gray-800">
                <option value="">Select Company</option>
                <option value="IPS">IPS</option>
                <option value="GMEC">GMEC</option>
                <option value="TASCON">TASCON</option>
                <option value="FPS">FPS</option>
              </select>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-6" onClick={addEmployee}>Add Employee</button>
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
              <table className="w-full border-collapse border border-gray-300">                                                                                                                       
                  <thead className="bg-blue-600 text-white">
                   <tr>
                     <th className="border px-4 py-2">ID</th>
                     <th className="border px-4 py-2">Full Name</th>
                     <th className="border px-4 py-2">Phone</th>
                     <th className="border px-4 py-2">Email</th>
                     <th className="border px-4 py-2">Company</th>
                     <th className="border px-4 py-2">Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {employees.map((emp) => (
                    <tr key={emp.id} className="text-center bg-gray-50 hover:bg-gray-100">
                      <td className="border px-4 py-2 text-black">{emp.id}</td>
                      <td className="border px-4 py-2 text-black">{emp.firstName} {emp.lastName}</td>
                      <td className="border px-4 py-2 text-black">{emp.phone}</td>
                      <td className="border px-4 py-2 text-black">{emp.email}</td>
                      <td className="border px-4 py-2 text-black">{emp.department}</td>
                      <td className="border px-4 py-2 text-black">
                        <button className="text-blue-500 underline px-3 py-1" onClick={() => viewEmployeeDetails(emp)}>View</button>
                        <button className="text-red-500 underline px-3 py-1" onClick={() => deleteEmployee(emp.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "leads" && (
          <>
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Leads</h1>
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="w-full border-collapse border border-gray-300">
  <thead className="bg-blue-600 text-white">
    <tr>
      <th className="border px-4 py-2">ID</th>
      <th className="border px-4 py-2">Name</th>
      <th className="border px-4 py-2">Email</th>
      <th className="border px-4 py-2">Phone</th>
      <th className="border px-4 py-2">Company</th>
    </tr>
  </thead>
  <tbody>
    {leads.map((lead) => (
      <tr key={lead.id} className="text-center bg-gray-50 hover:bg-gray-100">
        <td className="border px-4 py-2">{lead.id}</td>
        <td className="border px-4 py-2">{lead.name}</td>
        <td className="border px-4 py-2">{lead.email}</td>
        <td className="border px-4 py-2">{lead.phone}</td>
        <td className="border px-4 py-2">{lead.company}</td>
      </tr>
    ))}
  </tbody>
</table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

