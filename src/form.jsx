// import { useState } from "react";
// import axios from "axios";

// export default function App() {
//   const initialState = {
//     fullName: "",
//     dob: "",
//     gender: "",
//     mobile: "",
//     email: "",
//     address: "",
//     dgca: "",
//     egca: "",
//     medical: "",
//     parentName: "",
//     relationship: "",
//     parentMobile: "",
//     occupation: "",
//     school: "",
//     classYear: "",
//     board: "",
//     course: "",
//     grossFee: "",
//     regFee: "",
//     discount: "",
//     netFee: "",
//     paymentMode: "",
//     installment: "",
//   };

//   const [form, setForm] = useState(initialState);
//   const [files, setFiles] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState("");

//   const paymentOptions = [
//     { value: "", label: "Select Payment Mode" },
//     { value: "Cash", label: "Cash" },
//     { value: "UPI", label: "UPI" },
//     { value: "Net Banking", label: "Net Banking" },
//     { value: "Cheque", label: "Cheque" },
//   ];

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleFile = (e) => {
//     const file = e.target.files[0];

//     if (file) {
//       // Check file type
//       const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];

//       if (!validTypes.includes(file.type)) {
//         setStatus("❌ Only PNG and JPEG images are allowed");
//         e.target.value = ""; // Clear the input
//         return;
//       }

//       // Optional: Check file size (e.g., max 5MB)
//       const maxSize = 2 * 1024 * 1024; // 2MB in bytes
//       if (file.size > maxSize) {
//         setStatus("❌ File size must be less than 2MB");
//         e.target.value = ""; // Clear the input
//         return;
//       }

//       setFiles({ ...files, [e.target.name]: file });
//       setStatus(""); // Clear any previous error
//     }
//   };

//   const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setStatus("");

//     const formData = new FormData();
//     Object.keys(form).forEach((key) => formData.append(key, form[key]));
//     Object.keys(files).forEach((key) => formData.append(key, files[key]));

//     try {
//       await Promise.all([
//         axios.post("http://localhost:5000/api/submit", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         }),
//         delay(5000),
//       ]);

//       setStatus("✅ Form submitted successfully");
//       setForm(initialState);
//       setFiles({});
//       e.target.reset();
//     } catch (err) {
//       setStatus(`❌ ${err.response?.data?.error || "Submission failed"}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-5xl mx-auto">
//         <div className="text-center mb-12">
//           <h2
//             className="text-3xl sm:text-5xl font-bold mb-2"
//             style={{ color: "black" }}
//           >
//             STUDENT ADMISSION FORM
//           </h2>
//           <p className="text-xl font-bold" style={{ color: "#f4b221" }}>
//             SKYPRO Aviation Academy
//           </p>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="bg-white shadow-2xl rounded-3xl p-8 sm:p-12 border border-gray-200"
//         >
//           {status && (
//             <div
//               className={`mb-8 p-4 rounded-2xl text-center font-medium text-lg ${
//                 status.includes("successfully")
//                   ? "bg-green-100 text-green-800 border-2 border-green-200"
//                   : "bg-red-100 text-red-800 border-2 border-red-200"
//               }`}
//             >
//               {status}
//             </div>
//           )}

//           {/* 1. Student Details */}
//           <section className="mb-12">
//             <h3
//               className="text-2xl font-bold mb-3 pb-3"
//               style={{ color: "#003366" }}
//             >
//               1. Student Details
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="fullName"
//                   placeholder="Enter full name"
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       ""
//                     ))
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Date of Birth<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   name="dob"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Gender<span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex space-x-6 mt-2">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="gender"
//                       value="Male"
//                       className="mr-2 text-blue-500 focus:ring-blue-300"
//                       required
//                       onChange={handleChange}
//                     />
//                     Male
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="gender"
//                       value="Female"
//                       className="mr-2 text-blue-500 focus:ring-blue-300"
//                       required
//                       onChange={handleChange}
//                     />
//                     Female
//                   </label>
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Mobile No.<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="mobile"
//                   type="tel"
//                   placeholder="10-digit mobile number"
//                   inputMode="numeric"
//                   pattern="[0-9]{10}"
//                   maxLength={10}
//                   title="Enter a valid 10-digit mobile number"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(/\D/g, ""))
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Email Address<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="your@email.com"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Residential Address<span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="address"
//                   placeholder="Enter complete residential address"
//                   rows="3"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 resize-vertical"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   DGCA Computer Number<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="dgca"
//                   placeholder="Enter DGCA number"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   eGCA Number<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="egca"
//                   placeholder="Enter eGCA number"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Medical Status<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="medical"
//                   placeholder="Medical Class I/II/III"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//           </section>

//           {/* 2. Parent / Guardian Details */}
//           <section className="mb-12">
//             <h3
//               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
//               style={{ color: "#003366" }}
//             >
//               2. Parent / Guardian Details
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Parent/Guardian Name<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="parentName"
//                   type="text"
//                   placeholder="Enter full name"
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       ""
//                     ))
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Relationship<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="relationship"
//                   type="text"
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       ""
//                     ))
//                   }
//                   placeholder="Father/Mother/Guardian"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Mobile No.<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="parentMobile"
//                   type="tel"
//                   placeholder="10-digit mobile number"
//                   inputMode="numeric"
//                   pattern="[0-9]{10}"
//                   maxLength={10}
//                   title="Enter a valid 10-digit mobile number"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(/\D/g, ""))
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Occupation<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="occupation"
//                   placeholder="Profession/Business"
//                   type="text"
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       ""
//                     ))
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//           </section>

//           {/* 3. Academic Details */}
//           <section className="mb-12">
//             <h3
//               className="text-2xl font-bold text-gray-900 mb-3 pb-3 "
//               style={{ color: "#003366" }}
//             >
//               3. Academic Details
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   School/College Name<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="school"
//                   placeholder="Institution name"
//                   type="text"
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       ""
//                     ))
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Current Class/Year<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="classYear"
//                   type="number"
//                   placeholder="Class 12 / 2026"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Board/University<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="board"
//                   placeholder="CBSE/ICSE/State Board"
//                   type="text"
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       ""
//                     ))
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//           </section>

//           {/* 4. Course Details */}
//           <section className="mb-12">
//             <h3 className="text-2xl font-bold text-gray-900 mb-3 pb-3">
//               4. Course Details
//             </h3>
//             <div>
//               <label className="block text-lg font-bold text-gray-700 mb-2">
//                 Course Name<span className="text-red-500">*</span>
//               </label>
//               <input
//                 name="course"
//                 placeholder="Ground Classes / CPL / etc."
//                 type="text"
//                 inputMode="text"
//                 pattern="[A-Za-z\s]+"
//                 title="Only alphabets allowed"
//                 onInput={(e) =>
//                   (e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ""))
//                 }
//                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                 required
//                 onChange={handleChange}
//               />
//             </div>
//           </section>

//           {/* 5. Fee Structure */}
//           <section className="mb-12">
//             <h3
//               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
//               style={{ color: "#003366" }}
//             >
//               5. Fee Structure
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Gross Course Fee<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="grossFee"
//                   type="number"
//                   placeholder="₹ 1,50,000"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Registration Fee<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="regFee"
//                   type="number"
//                   placeholder="₹ 10,000"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Discount<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="discount"
//                   type="number"
//                   placeholder="₹ 5,000"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Net Fee Payable<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="netFee"
//                   type="number"
//                   placeholder="₹ 1,55,000"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Payment Mode<span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="paymentMode"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white"
//                   onChange={handleChange}
//                   required
//                 >
//                   {paymentOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Installment Applicable<span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex space-x-6 mt-2">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="installment"
//                       value="Yes"
//                       className="mr-2 text-yellow-500 focus:ring-yellow-500"
//                       required
//                       onChange={handleChange}
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="installment"
//                       value="No"
//                       className="mr-2 text-yellow-500 focus:ring-yellow-500"
//                       required
//                       onChange={handleChange}
//                     />
//                     No
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* 6. Documents Submitted */}
//           <section className="mb-12">
//             <h3
//               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
//               style={{ color: "#003366" }}
//             >
//               6. Documents Submitted
//             </h3>
//             <p className="text-sm text-gray-600 mb-4">Only PNG and JPEG formats are accepted (Max 2MB per file)</p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Address Proof<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="file"
//                   name="addressProof"
//                   accept="image/png, image/jpeg, image/jpg"
//                   className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
//                   required
//                   onChange={handleFile}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Passport Size Photo<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="file"
//                   name="photo"
//                   accept="image/png, image/jpeg, image/jpg"
//                   className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
//                   required
//                   onChange={handleFile}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Payment Receipt<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="file"
//                   name="paymentReceipt"
//                   accept="image/png, image/jpeg, image/jpg"
//                   className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
//                   required
//                   onChange={handleFile}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   10th Marksheet<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="file"
//                   name="marksheet10"
//                   accept="image/png, image/jpeg, image/jpg"
//                   className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
//                   required
//                   onChange={handleFile}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   12th Marksheet<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="file"
//                   name="marksheet12"
//                   accept="image/png, image/jpeg, image/jpg"
//                   className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
//                   required
//                   onChange={handleFile}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Aadhaar Card<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="file"
//                   name="aadhar"
//                   accept="image/png, image/jpeg, image/jpg"
//                   className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
//                   required
//                   onChange={handleFile}
//                 />
//               </div>
//             </div>
//           </section>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#003366] hover:bg-black disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-xl hover:shadow-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-500"
//           >
//             {loading ? "Submitting..." : "Submit Application"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }







// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function App() {
//   const initialState = {
//     fullName: "",
//     dob: "",
//     gender: "",
//     mobile: "",
//     email: "",
//     address: "",
//     dgca: "",
//     egca: "",
//     medical: "",
//     parentName: "",
//     relationship: "",
//     parentMobile: "",
//     occupation: "",
//     school: "",
//     classYear: "",
//     board: "",
//     course: "",
//     grossFee: "",
//     regFee: "",
//     discount: "",
//     netFee: "",
//     paymentMode: "",
//     installment: "",
//   };

//   const [form, setForm] = useState(initialState);
//   const [files, setFiles] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState("");
//   const [fileErrors, setFileErrors] = useState({});
//   const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
//   // const [recaptchaToken, setRecaptchaToken] = useState("");

//   // Load reCAPTCHA script
//   // useEffect(() => {
//   //   const script = document.createElement("script");
//   //   script.src = "https://www.google.com/recaptcha/api.js";
//   //   script.async = true;
//   //   script.defer = true;
//   //   document.body.appendChild(script);

//   //   return () => {
//   //     document.body.removeChild(script);
//   //   };
//   // }, []);

//   const paymentOptions = [
//     { value: "", label: "Select Payment Mode" },
//     { value: "Cash", label: "Cash" },
//     { value: "UPI", label: "UPI" },
//     { value: "Net Banking", label: "Net Banking" },
//     { value: "Cheque", label: "Cheque" },
//   ];

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleFile = (e) => {
//     const file = e.target.files[0];
//     const fieldName = e.target.name;

//     // Clear previous error for this field
//     setFileErrors((prev) => ({ ...prev, [fieldName]: "" }));

//     if (file) {
//       // Check file type
//       const validTypes = ["image/png", "image/jpeg", "image/jpg"];

//       if (!validTypes.includes(file.type)) {
//         const errorMsg = `Only PNG and JPEG images are allowed for ${fieldName}`;
//         setFileErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
//         setStatus(`❌ ${errorMsg}`);
//         e.target.value = ""; // Clear the input
//         return;
//       }

//       // Check file size (max 2MB)
//       const maxSize = 2 * 1024 * 1024; // 2MB in bytes
//       if (file.size > maxSize) {
//         const errorMsg = `File size must be less than 2MB for ${fieldName}`;
//         setFileErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
//         setStatus(`❌ ${errorMsg}`);
//         e.target.value = ""; // Clear the input
//         return;
//       }

//       setFiles({ ...files, [fieldName]: file });
//       setStatus(""); // Clear any previous error
//     }
//   };

//   const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check if disclaimer is accepted
//     if (!disclaimerAccepted) {
//       setStatus("❌ Please accept the disclaimer to proceed");
//       return;
//     }

//     // // Check reCAPTCHA
//     // const recaptchaResponse = window.grecaptcha?.getResponse();
//     // if (!recaptchaResponse) {
//     //   setStatus("❌ Please complete the reCAPTCHA verification");
//     //   return;
//     // }

//     setLoading(true);
//     setStatus("");

//     const formData = new FormData();
//     Object.keys(form).forEach((key) => formData.append(key, form[key]));
//     Object.keys(files).forEach((key) => formData.append(key, files[key]));
//     // formData.append("recaptchaToken", recaptchaResponse);

//     try {
//       await Promise.all([
//         axios.post("http://localhost:5000/api/submit", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         }),
//         delay(5000),
//       ]);

//       setStatus("✅ Form submitted successfully");
//       setForm(initialState);
//       setFiles({});
//       setFileErrors({});
//       setDisclaimerAccepted(false);
//       e.target.reset();
//       // window.grecaptcha?.reset();
//     } catch (err) {
//       setStatus(`❌ ${err.response?.data?.error || "Submission failed"}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-5xl mx-auto">
//         <div className="text-center mb-12">
//           <h2
//             className="text-3xl sm:text-5xl font-bold mb-2"
//             style={{ color: "black" }}
//           >
//             STUDENT ADMISSION FORM
//           </h2>
//           <p className="text-xl font-bold" style={{ color: "#f4b221" }}>
//             SKYPRO Aviation Academy
//           </p>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="bg-white shadow-2xl rounded-3xl p-8 sm:p-12 border border-gray-200"
//         >
//           {status && (
//             <div
//               className={`mb-8 p-4 rounded-2xl text-center font-medium text-lg ${
//                 status.includes("successfully")
//                   ? "bg-green-100 text-green-800 border-2 border-green-200"
//                   : "bg-red-100 text-red-800 border-2 border-red-200"
//               }`}
//             >
//               {status}
//             </div>
//           )}

//           {/* 1. Student Details */}
//           <section className="mb-12">
//             <h3
//               className="text-2xl font-bold mb-3 pb-3"
//               style={{ color: "#003366" }}
//             >
//               1. Student Details
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="fullName"
//                   placeholder="Enter full name"
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       ""
//                     ))
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Date of Birth<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   name="dob"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Gender<span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex space-x-6 mt-2">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="gender"
//                       value="Male"
//                       className="mr-2 text-blue-500 focus:ring-blue-300"
//                       required
//                       onChange={handleChange}
//                     />
//                     Male
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="gender"
//                       value="Female"
//                       className="mr-2 text-blue-500 focus:ring-blue-300"
//                       required
//                       onChange={handleChange}
//                     />
//                     Female
//                   </label>
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Mobile No.<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="mobile"
//                   type="tel"
//                   placeholder="10-digit mobile number"
//                   inputMode="numeric"
//                   pattern="[0-9]{10}"
//                   maxLength={10}
//                   title="Enter a valid 10-digit mobile number"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(/\D/g, ""))
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Email Address<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="your@email.com"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Residential Address<span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="address"
//                   placeholder="Enter complete residential address"
//                   rows="3"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 resize-vertical"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   DGCA Computer Number<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="dgca"
//                   placeholder="Enter DGCA number"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   eGCA Number<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="egca"
//                   placeholder="Enter eGCA number"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Medical Status<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="medical"
//                   placeholder="Medical Class I/II/III"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//           </section>

//           {/* 2. Parent / Guardian Details */}
//           <section className="mb-12">
//             <h3
//               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
//               style={{ color: "#003366" }}
//             >
//               2. Parent / Guardian Details
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Parent/Guardian Name<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="parentName"
//                   type="text"
//                   placeholder="Enter full name"
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       ""
//                     ))
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Relationship<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="relationship"
//                   type="text"
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       ""
//                     ))
//                   }
//                   placeholder="Father/Mother/Guardian"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Mobile No.<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="parentMobile"
//                   type="tel"
//                   placeholder="10-digit mobile number"
//                   inputMode="numeric"
//                   pattern="[0-9]{10}"
//                   maxLength={10}
//                   title="Enter a valid 10-digit mobile number"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(/\D/g, ""))
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Occupation<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="occupation"
//                   placeholder="Profession/Business"
//                   type="text"
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       ""
//                     ))
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//           </section>

//           {/* 3. Academic Details */}
//           <section className="mb-12">
//             <h3
//               className="text-2xl font-bold text-gray-900 mb-3 pb-3 "
//               style={{ color: "#003366" }}
//             >
//               3. Academic Details
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   School/College Name<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="school"
//                   placeholder="Institution name"
//                   type="text"
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       ""
//                     ))
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Current Class/Year<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="classYear"
//                   type="number"
//                   placeholder="Class 12 / 2026"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Board/University<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="board"
//                   placeholder="CBSE/ICSE/State Board"
//                   type="text"
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       ""
//                     ))
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//           </section>

//           {/* 4. Course Details */}
//           <section className="mb-12">
//             <h3
//               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
//               style={{ color: "#003366" }}
//             >
//               4. Course Details
//             </h3>
//             <div>
//               <label className="block text-lg font-bold text-gray-700 mb-2">
//                 Course Name<span className="text-red-500">*</span>
//               </label>
//               <input
//                 name="course"
//                 placeholder="Ground Classes / CPL / etc."
//                 type="text"
//                 inputMode="text"
//                 pattern="[A-Za-z\s]+"
//                 title="Only alphabets allowed"
//                 onInput={(e) =>
//                   (e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ""))
//                 }
//                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                 required
//                 onChange={handleChange}
//               />
//             </div>
//           </section>

//           {/* 5. Fee Structure */}
//           <section className="mb-12">
//             <h3
//               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
//               style={{ color: "#003366" }}
//             >
//               5. Fee Structure
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Gross Course Fee<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="grossFee"
//                   type="number"
//                   placeholder="₹ 1,50,000"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Registration Fee<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="regFee"
//                   type="number"
//                   placeholder="₹ 10,000"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Discount<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="discount"
//                   type="number"
//                   placeholder="₹ 5,000"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Net Fee Payable<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="netFee"
//                   type="number"
//                   placeholder="₹ 1,55,000"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Payment Mode<span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="paymentMode"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white"
//                   onChange={handleChange}
//                   required
//                 >
//                   {paymentOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Installment Applicable<span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex space-x-6 mt-2">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="installment"
//                       value="Yes"
//                       className="mr-2 text-yellow-500 focus:ring-yellow-500"
//                       required
//                       onChange={handleChange}
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="installment"
//                       value="No"
//                       className="mr-2 text-yellow-500 focus:ring-yellow-500"
//                       required
//                       onChange={handleChange}
//                     />
//                     No
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* 6. Documents Submitted */}
//           <section className="mb-12">
//             <h3
//               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
//               style={{ color: "#003366" }}
//             >
//               6. Documents Submitted
//             </h3>
//             <p className="text-sm text-gray-600 mb-4">
//               Only PNG and JPEG formats are accepted (Max 2MB per file)
//             </p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[
//                 { name: "addressProof", label: "Address Proof" },
//                 { name: "photo", label: "Passport Size Photo" },
//                 { name: "paymentReceipt", label: "Payment Receipt" },
//                 { name: "marksheet10", label: "10th Marksheet" },
//                 { name: "marksheet12", label: "12th Marksheet" },
//                 { name: "aadhar", label: "Aadhaar Card" },
//               ].map((field) => (
//                 <div key={field.name}>
//                   <label className="block text-lg font-bold text-gray-700 mb-2">
//                     {field.label}
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="file"
//                     name={field.name}
//                     accept="image/png, image/jpeg, image/jpg"
//                     className={`w-full px-4 py-3 border-2 border-dashed rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 ${
//                       fileErrors[field.name]
//                         ? "border-red-400 bg-red-50"
//                         : "border-gray-300"
//                     }`}
//                     required
//                     onChange={handleFile}
//                   />
//                   {fileErrors[field.name] && (
//                     <p className="text-red-600 text-sm mt-1">
//                       {fileErrors[field.name]}
//                     </p>
//                   )}
//                   {files[field.name] && !fileErrors[field.name] && (
//                     <p className="text-green-600 text-sm mt-1">
//                       ✓ {files[field.name].name}
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Disclaimer */}
//           <section className="mb-8">
//             <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
//               <h3 className="text-xl font-bold text-gray-900 mb-3">
//                 Declaration & Disclaimer
//               </h3>
//               {/* <div className="text-sm text-gray-700 space-y-2 mb-4">
//                 <p>• I hereby declare that all information provided in this form is true and accurate to the best of my knowledge.</p>
//                 <p>• I understand that any false information may lead to cancellation of my admission.</p>
//                 <p>• I agree to abide by all rules and regulations of SKYPRO Aviation Academy.</p>
//                 <p>• I authorize the academy to verify the documents and information provided.</p>
//                 <p>• All uploaded documents are genuine and belong to the applicant.</p>
//               </div> */}
//               <label className="flex items-start">
//                 <input
//                   type="checkbox"
//                   checked={disclaimerAccepted}
//                   onChange={(e) => setDisclaimerAccepted(e.target.checked)}
//                   className="mt-1 mr-3 text-blue-500 focus:ring-blue-300"
//                   required
//                 />
//                 <span className="text-gray-800 font-medium">
//                   I hereby declare that all the information provided above is
//                   true and correct to the best of my knowledge. I understand
//                   that any false information may result in the cancellation of
//                   my admission.
//                   <span className="text-red-500">*</span>
//                 </span>
//               </label>
//             </div>
//           </section>

//           {/* reCAPTCHA */}
//           {/* <div className="mb-8 flex justify-center">
//             <div
//               className="g-recaptcha"
//               data-sitekey="YOUR_RECAPTCHA_SITE_KEY"
//             ></div>
//           </div> */}

//           <button
//             type="submit"
//             disabled={loading || !disclaimerAccepted}
//             className="w-full bg-[#003366] hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-xl hover:shadow-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-500"
//           >
//             {loading ? "Submitting..." : "Submit Application"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }



































import { useState } from "react";
import axios from "axios";

export default function App() {
  const initialState = {
    fullName: "",
    dob: "",
    gender: "",
    mobile: "",
    email: "",
    permanentAddress: "",
    currentAddress: "",
    dgca: "",
    egca: "",
    medical: "",
    parentName: "",
    relationship: "",
    parentMobile: "",
    occupation: "",
    school: "",
    classYear: "",
    board: "",
    course: "",
    grossFee: "",
    regFee: "",
    discount: "",
    netFee: "",
    paymentMode: "",
    installment: "",
  };

  const [form, setForm] = useState(initialState);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [fileErrors, setFileErrors] = useState({});
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);
  // const [recaptchaToken, setRecaptchaToken] = useState("");

  // Load reCAPTCHA script
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://www.google.com/recaptcha/api.js";
  //   script.async = true;
  //   script.defer = true;
  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  const paymentOptions = [
    { value: "", label: "Select Payment Mode" },
    { value: "Cash", label: "Cash" },
    { value: "UPI", label: "UPI" },
    { value: "Net Banking", label: "Net Banking" },
    { value: "Cheque", label: "Cheque" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // If permanent address changes and checkbox is checked, update current address
    if (name === "permanentAddress" && sameAddress) {
      setForm(prev => ({ ...prev, currentAddress: value }));
    }
  };

  const handleSameAddressChange = (e) => {
    const checked = e.target.checked;
    setSameAddress(checked);
    
    // If checkbox is checked, copy permanent address to current address
    if (checked) {
      setForm(prev => ({ ...prev, currentAddress: prev.permanentAddress }));
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;

    setFileErrors((prev) => ({ ...prev, [fieldName]: "" }));

    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];

      if (!validTypes.includes(file.type)) {
        const errorMsg = `Only PNG and JPEG images are allowed for ${fieldName}`;
        setFileErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
        setStatus(`❌ ${errorMsg}`);
        e.target.value = "";
        return;
      }

      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        const errorMsg = `File size must be less than 2MB for ${fieldName}`;
        setFileErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
        setStatus(`❌ ${errorMsg}`);
        e.target.value = "";
        return;
      }

      setFiles({ ...files, [fieldName]: file });
      setStatus("");
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!disclaimerAccepted) {
      setStatus("❌ Please accept the disclaimer to proceed");
      return;
    }

    // // Check reCAPTCHA
    // const recaptchaResponse = window.grecaptcha?.getResponse();
    // if (!recaptchaResponse) {
    //   setStatus("❌ Please complete the reCAPTCHA verification");
    //   return;
    // }

    setLoading(true);
    setStatus("");

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    Object.keys(files).forEach((key) => formData.append(key, files[key]));
    // formData.append("recaptchaToken", recaptchaResponse);

    try {
      await Promise.all([
        axios.post("http://localhost:5000/api/submit", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
        delay(5000),
      ]);

      setStatus("✅ Form submitted successfully");
      setForm(initialState);
      setFiles({});
      setFileErrors({});
      setDisclaimerAccepted(false);
      setSameAddress(false);
      e.target.reset();
      // window.grecaptcha?.reset();
    } catch (err) {
      setStatus(`❌ ${err.response?.data?.error || "Submission failed"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-5xl font-bold mb-2"
            style={{ color: "black" }}
          >
            STUDENT ADMISSION FORM
          </h2>
          <p className="text-xl font-bold" style={{ color: "#f4b221" }}>
            SKYPRO Aviation Academy
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-3xl p-8 sm:p-12 border border-gray-200"
        >
          {status && (
            <div
              className={`mb-8 p-4 rounded-2xl text-center font-medium text-lg ${
                status.includes("successfully")
                  ? "bg-green-100 text-green-800 border-2 border-green-200"
                  : "bg-red-100 text-red-800 border-2 border-red-200"
              }`}
            >
              {status}
            </div>
          )}

          {/* 1. Student Details */}
          <section className="mb-12">
            <h3
              className="text-2xl font-bold mb-3 pb-3"
              style={{ color: "#003366" }}
            >
              1. Student Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="fullName"
                  placeholder="Enter full name"
                  inputMode="text"
                  pattern="[A-Za-z\s]+"
                  title="Only alphabets allowed"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(
                      /[^A-Za-z\s]/g,
                      ""
                    ))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Date of Birth<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Gender<span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      className="mr-2 text-blue-500 focus:ring-blue-300"
                      required
                      onChange={handleChange}
                    />
                    Male
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      className="mr-2 text-blue-500 focus:ring-blue-300"
                      required
                      onChange={handleChange}
                    />
                    Female
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Mobile No.<span className="text-red-500">*</span>
                </label>
                <input
                  name="mobile"
                  type="tel"
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  title="Enter a valid 10-digit mobile number"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Email Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>
              
              {/* Permanent Address */}
              <div className="md:col-span-2">
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Permanent Address<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="permanentAddress"
                  value={form.permanentAddress}
                  placeholder="Enter complete permanent address"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 resize-vertical"
                  required
                  onChange={handleChange}
                />
              </div>

              {/* Same as Permanent Address Checkbox */}
              <div className="md:col-span-2 -mt-4 -mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sameAddress}
                    onChange={handleSameAddressChange}
                    className="mr-3 text-blue-500 focus:ring-blue-300 w-4 h-4"
                  />
                  <span className="text-gray-700 font-medium">
                    Current address same as permanent address
                  </span>
                </label>
              </div>

              {/* Current Address */}
              <div className="md:col-span-2">
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Current Address<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="currentAddress"
                  value={form.currentAddress}
                  placeholder="Enter complete current address"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 resize-vertical"
                  required
                  onChange={handleChange}
                  disabled={sameAddress}
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  DGCA Computer Number<span className="text-red-500">*</span>
                </label>
                <input
                  name="dgca"
                  placeholder="Enter DGCA number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  eGCA Number<span className="text-red-500">*</span>
                </label>
                <input
                  name="egca"
                  placeholder="Enter eGCA number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Medical Status<span className="text-red-500">*</span>
                </label>
                <input
                  name="medical"
                  placeholder="Medical Class I/II/III"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* 2. Parent / Guardian Details */}
          <section className="mb-12">
            <h3
              className="text-2xl font-bold text-gray-900 mb-3 pb-3"
              style={{ color: "#003366" }}
            >
              2. Parent / Guardian Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Parent/Guardian Name<span className="text-red-500">*</span>
                </label>
                <input
                  name="parentName"
                  type="text"
                  placeholder="Enter full name"
                  inputMode="text"
                  pattern="[A-Za-z\s]+"
                  title="Only alphabets allowed"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(
                      /[^A-Za-z\s]/g,
                      ""
                    ))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Relationship<span className="text-red-500">*</span>
                </label>
                <input
                  name="relationship"
                  type="text"
                  inputMode="text"
                  pattern="[A-Za-z\s]+"
                  title="Only alphabets allowed"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(
                      /[^A-Za-z\s]/g,
                      ""
                    ))
                  }
                  placeholder="Father/Mother/Guardian"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Mobile No.<span className="text-red-500">*</span>
                </label>
                <input
                  name="parentMobile"
                  type="tel"
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  title="Enter a valid 10-digit mobile number"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Occupation<span className="text-red-500">*</span>
                </label>
                <input
                  name="occupation"
                  placeholder="Profession/Business"
                  type="text"
                  inputMode="text"
                  pattern="[A-Za-z\s]+"
                  title="Only alphabets allowed"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(
                      /[^A-Za-z\s]/g,
                      ""
                    ))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* 3. Academic Details */}
          <section className="mb-12">
            <h3
              className="text-2xl font-bold text-gray-900 mb-3 pb-3 "
              style={{ color: "#003366" }}
            >
              3. Academic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  School/College Name<span className="text-red-500">*</span>
                </label>
                <input
                  name="school"
                  placeholder="Institution name"
                  type="text"
                  inputMode="text"
                  pattern="[A-Za-z\s]+"
                  title="Only alphabets allowed"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(
                      /[^A-Za-z\s]/g,
                      ""
                    ))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Current Class/Year<span className="text-red-500">*</span>
                </label>
                <input
                  name="classYear"
                  type="number"
                  placeholder="Class 12 / 2026"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Board/University<span className="text-red-500">*</span>
                </label>
                <input
                  name="board"
                  placeholder="CBSE/ICSE/State Board"
                  type="text"
                  inputMode="text"
                  pattern="[A-Za-z\s]+"
                  title="Only alphabets allowed"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(
                      /[^A-Za-z\s]/g,
                      ""
                    ))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* 4. Course Details */}
          <section className="mb-12">
            <h3
              className="text-2xl font-bold text-gray-900 mb-3 pb-3"
              style={{ color: "#003366" }}
            >
              4. Course Details
            </h3>
            <div>
              <label className="block text-lg font-bold text-gray-700 mb-2">
                Course Name<span className="text-red-500">*</span>
              </label>
              <input
                name="course"
                placeholder="Ground Classes / CPL / etc."
                type="text"
                inputMode="text"
                pattern="[A-Za-z\s]+"
                title="Only alphabets allowed"
                onInput={(e) =>
                  (e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ""))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                required
                onChange={handleChange}
              />
            </div>
          </section>

          {/* 5. Fee Structure */}
          <section className="mb-12">
            <h3
              className="text-2xl font-bold text-gray-900 mb-3 pb-3"
              style={{ color: "#003366" }}
            >
              5. Fee Structure
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Gross Course Fee<span className="text-red-500">*</span>
                </label>
                <input
                  name="grossFee"
                  type="number"
                  placeholder="₹ 1,50,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Registration Fee<span className="text-red-500">*</span>
                </label>
                <input
                  name="regFee"
                  type="number"
                  placeholder="₹ 10,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Discount<span className="text-red-500">*</span>
                </label>
                <input
                  name="discount"
                  type="number"
                  placeholder="₹ 5,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Net Fee Payable<span className="text-red-500">*</span>
                </label>
                <input
                  name="netFee"
                  type="number"
                  placeholder="₹ 1,55,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Payment Mode<span className="text-red-500">*</span>
                </label>
                <select
                  name="paymentMode"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white"
                  onChange={handleChange}
                  required
                >
                  {paymentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Installment Applicable<span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="installment"
                      value="Yes"
                      className="mr-2 text-yellow-500 focus:ring-yellow-500"
                      required
                      onChange={handleChange}
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="installment"
                      value="No"
                      className="mr-2 text-yellow-500 focus:ring-yellow-500"
                      required
                      onChange={handleChange}
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Documents Submitted */}
          <section className="mb-12">
            <h3
              className="text-2xl font-bold text-gray-900 mb-3 pb-3"
              style={{ color: "#003366" }}
            >
              6. Documents Submitted
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Only PNG and JPEG formats are accepted (Max 2MB per file)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "addressProof", label: "Address Proof" },
                { name: "photo", label: "Passport Size Photo" },
                { name: "paymentReceipt", label: "Payment Receipt" },
                { name: "marksheet10", label: "10th Marksheet" },
                { name: "marksheet12", label: "12th Marksheet" },
                { name: "aadhar", label: "Aadhaar Card" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    {field.label}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name={field.name}
                    accept="image/png, image/jpeg, image/jpg"
                    className={`w-full px-4 py-3 border-2 border-dashed rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 ${
                      fileErrors[field.name]
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                    onChange={handleFile}
                  />
                  {fileErrors[field.name] && (
                    <p className="text-red-600 text-sm mt-1">
                      {fileErrors[field.name]}
                    </p>
                  )}
                  {files[field.name] && !fileErrors[field.name] && (
                    <p className="text-green-600 text-sm mt-1">
                      ✓ {files[field.name].name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <section className="mb-8">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Declaration & Disclaimer
              </h3>
              {/* <div className="text-sm text-gray-700 space-y-2 mb-4">
                <p>• I hereby declare that all information provided in this form is true and accurate to the best of my knowledge.</p>
                <p>• I understand that any false information may lead to cancellation of my admission.</p>
                <p>• I agree to abide by all rules and regulations of SKYPRO Aviation Academy.</p>
                <p>• I authorize the academy to verify the documents and information provided.</p>
                <p>• All uploaded documents are genuine and belong to the applicant.</p>
              </div> */}
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={disclaimerAccepted}
                  onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                  className="mt-1 mr-3 text-blue-500 focus:ring-blue-300"
                  required
                />
                <span className="text-gray-800 font-medium">
                  I hereby declare that all the information provided above is
                  true and correct to the best of my knowledge. I understand
                  that any false information may result in the cancellation of
                  my admission.
                  <span className="text-red-500">*</span>
                </span>
              </label>
            </div>
          </section>

          {/* reCAPTCHA */}
          {/* <div className="mb-8 flex justify-center">
            <div
              className="g-recaptcha"
              data-sitekey="YOUR_RECAPTCHA_SITE_KEY"
            ></div>
          </div> */}

          <button
            type="submit"
            disabled={loading || !disclaimerAccepted}
            className="w-full bg-[#003366] hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-xl hover:shadow-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-500"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}