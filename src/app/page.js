// "use client"; 

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function Home() {
//   const router = useRouter();
//   const [employees, setEmployees] = useState(null); // ✅ Initialize with null
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     phone: "",
//     department: "",
//   });

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedEmployees = JSON.parse(localStorage.getItem("employees")) || [];
//       setEmployees(storedEmployees);
//     }
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const addEmployee = () => {
//     if (!form.firstName || !form.lastName || !form.phone || !form.department)
//       return alert("All fields are required!");

//     const newEmployee = {
//       id: employees.length + 1, // ✅ Auto-generate ID
//       firstName: form.firstName,
//       lastName: form.lastName,
//       phone: form.phone,
//       department: form.department,
//     };

//     const updatedEmployees = [...employees, newEmployee];
//     setEmployees(updatedEmployees);
//     localStorage.setItem("employees", JSON.stringify(updatedEmployees));

//     setForm({ firstName: "", lastName: "", phone: "", department: "" });
//   };

//   const deleteEmployee = (id) => {
//     const updatedEmployees = employees.filter((emp) => emp.id !== id);
//     setEmployees(updatedEmployees);
//     localStorage.setItem("employees", JSON.stringify(updatedEmployees));

//     const storedLeads = JSON.parse(localStorage.getItem("leads")) || {};
//     delete storedLeads[id];
//     localStorage.setItem("leads", JSON.stringify(storedLeads));
//   };

//   if (employees === null) return <p className="text-red-500">Loading...</p>; // ✅ Fix hydration issue

//   return (
//     <div className="p-6 text-gray-800">
//       <h1 className="text-2xl font-bold mb-4 text-blue-700">Admin Panel</h1>

//       <div className="mb-4 grid grid-cols-2 gap-4">
//         <input
//           type="text"
//           name="firstName"
//           value={form.firstName}
//           onChange={handleChange}
//           placeholder="First Name"
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           name="lastName"
//           value={form.lastName}
//           onChange={handleChange}
//           placeholder="Last Name"
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           name="phone"
//           value={form.phone}
//           onChange={handleChange}
//           placeholder="Phone Number"
//           className="border p-2 rounded"
//         />
//         <select name="department" value={form.department} onChange={handleChange} className="border p-2 rounded">
//           <option value="">Select Department</option>
//           <option value="HR">HR</option>
//           <option value="Sales">Sales</option>
//           <option value="IT">IT</option>
//           <option value="Finance">Finance</option>
//         </select>
//       </div>

//       <button className="bg-green-500 text-white px-4 py-2 rounded mb-4" onClick={addEmployee}>
//         Add Employee
//       </button>

//       <table className="w-full border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2 text-purple-700">ID</th>
//             <th className="border p-2 text-purple-700">Full Name</th>
//             <th className="border p-2 text-purple-700">Phone</th>
//             <th className="border p-2 text-purple-700">Department</th>
//             <th className="border p-2 text-purple-700">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {employees.map((emp) => (
//             <tr key={emp.id} className="border">
//               <td className="border p-2 text-white">{emp.id}</td>
//               <td className="border p-2 text-white">{emp.firstName} {emp.lastName}</td>
//               <td className="border p-2 text-white">{emp.phone}</td>
//               <td className="border p-2 text-white">{emp.department}</td>
//               <td className="border p-2 flex gap-2">
//                 <button
//                   className="bg-blue-500 text-white px-3 py-1 rounded"
//                   onClick={() => router.push(`/employee/${emp.id}`)}
//                 >
//                   View
//                 </button>
//                 <button
//                   className="bg-red-500 text-white px-3 py-1 rounded"
//                   onClick={() => deleteEmployee(emp.id)}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
// export default function EmployeeDetails() {
//   const { id } = useParams();
//   const [employee, setEmployee] = useState({});
//   const [leads, setLeads] = useState([]);
//   const [leadText, setLeadText] = useState("");
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);

//     const storedEmployees = JSON.parse(localStorage.getItem("employees")) || [];
//     const emp = storedEmployees.find((e) => e.id === parseInt(id)) || {};
//     setEmployee(emp);

//     const storedLeads = JSON.parse(localStorage.getItem("leads")) || {};
//     setLeads(storedLeads[id] || []);
//   }, [id]);

//   if (!mounted) return <p className="text-red-500">Loading...</p>;

//   return (
//     <div className="p-6 text-white bg-gray-900 min-h-screen">
//       <h1 className="text-2xl font-bold text-white">{employee.firstName} {employee.lastName} Details</h1>
//       <p>ID: {employee.id}</p>
//       <p>Phone: {employee.phone}</p>
//       <p>Department: {employee.department}</p>
//       <p>Total Leads: {leads.length}</p>

//       <h2 className="text-lg font-semibold text-white mt-4">Leads List</h2>
//       <ul className="mt-2">
//         {leads.length > 0 ? (
//           leads.map((lead, index) => (
//             <li key={index} className="text-white border-b py-1">
//               {lead.text} - <span className="text-gray-300">{new Date(lead.date).toLocaleString()}</span>
//             </li>
//           ))
//         ) : (
//           <p className="text-gray-300">No leads added yet.</p>
//         )}
//       </ul>
//     </div>
//   );
// }
'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Choose Your Role</h1>
      <div className="flex gap-6">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md"
          onClick={() => router.push('/admin-login')}
        >
          Admin
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md"
          onClick={() => router.push('/employee-login')}
        >
          Employee
        </button>
      </div>
    </div>
  );
}
