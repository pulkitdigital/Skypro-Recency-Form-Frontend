// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function App() {
//   const initialState = {
//     fullName: "",
//     dob: "",
//     gender: "",
//     mobile: "",
//     email: "",
//     permanentAddress: "",
//     currentAddress: "",
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
//     modeOfClass: "",
//     feesPaid: "",
//     paymentMode: "",
//     installment: "",
//   };

//   const [form, setForm] = useState(initialState);
//   const [files, setFiles] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState("");
//   const [fileErrors, setFileErrors] = useState({});
//   const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
//   const [sameAddress, setSameAddress] = useState(false);
//   const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

//   // IMPORTANT: Replace with your actual reCAPTCHA Site Key
//   const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY; // Replace with your key
//   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   // Load reCAPTCHA script
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://www.google.com/recaptcha/api.js";
//     script.async = true;
//     script.defer = true;
//     script.onload = () => setRecaptchaLoaded(true);
//     document.body.appendChild(script);

//     return () => {
//       if (document.body.contains(script)) {
//         document.body.removeChild(script);
//       }
//     };
//   }, []);

//   const paymentOptions = [
//     { value: "", label: "Select Payment Mode" },
//     { value: "Cash", label: "Cash" },
//     { value: "UPI", label: "UPI" },
//     { value: "Net Banking", label: "Net Banking" },
//     { value: "Cheque", label: "Cheque" },
//   ];

//   const medicalOptions = [
//     { value: "", label: "Select Medical Status" },
//     { value: "N/A", label: "N/A" },
//     { value: "Medical Class 1", label: "Medical Class 1" },
//     { value: "Medical Class 2", label: "Medical Class 2" },
//   ];

//   const courseOptions = [
//     { value: "", label: "Select Course" },
//     { value: "DGCA Ground Classes", label: "DGCA Ground Classes" },
//     { value: "ATPL Theory Training", label: "ATPL Theory Training" },
//     { value: "Flight Training", label: "Flight Training" },
//     { value: "Type Rating", label: "Type Rating" },
//     { value: "Licence Conversion", label: "Licence Conversion" },
//     { value: "Mentorship Programme", label: "Mentorship Programme" },
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });

//     if (name === "permanentAddress" && sameAddress) {
//       setForm((prev) => ({ ...prev, currentAddress: value }));
//     }
//   };

//   const handleSameAddressChange = (e) => {
//     const checked = e.target.checked;
//     setSameAddress(checked);

//     if (checked) {
//       setForm((prev) => ({ ...prev, currentAddress: prev.permanentAddress }));
//     }
//   };

//   const handleFile = (e) => {
//     const file = e.target.files[0];
//     const fieldName = e.target.name;

//     setFileErrors((prev) => ({ ...prev, [fieldName]: "" }));

//     if (file) {
//       const validTypes = ["image/png", "image/jpeg", "image/jpg"];

//       if (!validTypes.includes(file.type)) {
//         const errorMsg = `Only PNG and JPEG images are allowed for ${fieldName}`;
//         setFileErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
//         setStatus(`❌ ${errorMsg}`);
//         e.target.value = "";
//         return;
//       }

//       const maxSize = 2 * 1024 * 1024;
//       if (file.size > maxSize) {
//         const errorMsg = `File size must be less than 2MB for ${fieldName}`;
//         setFileErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
//         setStatus(`❌ ${errorMsg}`);
//         e.target.value = "";
//         return;
//       }

//       setFiles({ ...files, [fieldName]: file });
//       setStatus("");
//     }
//   };

//   const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!disclaimerAccepted) {
//       setStatus("❌ Please accept the disclaimer to proceed");
//       return;
//     }

//     // Get reCAPTCHA token
//     const token = window.grecaptcha?.getResponse();

//     if (!token) {
//       setStatus("❌ Please complete the reCAPTCHA verification");
//       return;
//     }

//     setLoading(true);
//     setStatus("");

//     const formData = new FormData();
//     Object.keys(form).forEach((key) => formData.append(key, form[key]));
//     Object.keys(files).forEach((key) => formData.append(key, files[key]));
//     formData.append("recaptchaToken", token);

//     try {
//       await Promise.all([
//         axios.post(`${API_URL}/api/submit`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         }),
//         delay(5000),
//       ]);

//       setStatus("✅ Form submitted successfully");
//       setForm(initialState);
//       setFiles({});
//       setFileErrors({});
//       setDisclaimerAccepted(false);
//       setSameAddress(false);
//       window.grecaptcha?.reset();
//       e.target.reset();
//     } catch (err) {
//       setStatus(`❌ ${err.response?.data?.error || "Submission failed"}`);
//       window.grecaptcha?.reset();
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
//             SkyPro Aviation Academy
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
//                       "",
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
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="gender"
//                       value="Prefer not to say"
//                       className="mr-2 text-blue-500 focus:ring-blue-300"
//                       required
//                       onChange={handleChange}
//                     />
//                     Prefer not to say
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
//                   Permanent Address<span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="permanentAddress"
//                   value={form.permanentAddress}
//                   placeholder="Enter complete permanent address"
//                   rows="3"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 resize-vertical"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="md:col-span-2 -mt-4 -mb-4">
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={sameAddress}
//                     onChange={handleSameAddressChange}
//                     className="mr-3 text-blue-500 focus:ring-blue-300 w-4 h-4"
//                   />
//                   <span className="text-gray-700 font-medium">
//                     Current address same as permanent address
//                   </span>
//                 </label>
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Current Address<span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="currentAddress"
//                   value={form.currentAddress}
//                   placeholder="Enter complete current address"
//                   rows="3"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 resize-vertical"
//                   required
//                   onChange={handleChange}
//                   disabled={sameAddress}
//                 />
//               </div>

//               {/* <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   DGCA Computer Number
//                 </label>
//                 <input
//                   name="dgca"
//                   placeholder="Enter DGCA number"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   eGCA Number
//                 </label>
//                 <input
//                   name="egca"
//                   placeholder="Enter eGCA number"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   onChange={handleChange}
//                 />
//               </div> */}

//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   DGCA Computer Number
//                   <span className="text-sm font-normal text-gray-500 ml-2">
//                     (leave blank if not applicable)
//                   </span>
//                 </label>
//                 <input
//                   name="dgca"
//                   placeholder="Enter DGCA number"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   onChange={handleChange}
//                 />
//               </div>

//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   eGCA Number
//                   <span className="text-sm font-normal text-gray-500 ml-2">
//                     (leave blank if not applicable)
//                   </span>
//                 </label>
//                 <input
//                   name="egca"
//                   placeholder="Enter eGCA number"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Medical Status<span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="medical"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white"
//                   onChange={handleChange}
//                   required
//                 >
//                   {medicalOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
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
//                       "",
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
//                       "",
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
//                       "",
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
//               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
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
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               {/* <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Current Class/Year
//                 </label>
//                 <input
//                   name="classYear"
//                   type="text"
//                   placeholder="Class 12 / 2026"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   onChange={handleChange}
//                 />
//               </div> */}
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Current Education Qualification
//                 </label>

//                 <select
//                   name="classYear"
//                   defaultValue=""
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white"
//                 >
//                   <option value="">— Please choose an option —</option>
//                   <option value="Class 10">Class 10</option>
//                   <option value="12th Appearing">12th Appearing</option>
//                   <option value="12th Passed">12th Passed</option>
//                   <option value="Graduation 1st Year">Graduation</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Board/University<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="board"
//                   placeholder="CBSE/ICSE/State Board"
//                   type="text"
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
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Course Name<span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="course"
//                   className="w-[90%] px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white"
//                   onChange={handleChange}
//                   required
//                 >
//                   {courseOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Mode of Class
//                 </label>
//                 <div className="flex space-x-6 mt-2">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="modeOfClass"
//                       value="Online Class"
//                       className="mr-2 text-blue-500 focus:ring-blue-300"
//                       onChange={handleChange}
//                     />
//                     Online Class
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="modeOfClass"
//                       value="Offline Class"
//                       className="mr-2 text-blue-500 focus:ring-blue-300"
//                       onChange={handleChange}
//                     />
//                     Offline Class
//                   </label>
//                 </div>
//               </div>
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
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Fees Paid<span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex space-x-6 mt-2">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="feesPaid"
//                       value="Yes"
//                       className="mr-2 text-blue-500 focus:ring-blue-300"
//                       required
//                       onChange={handleChange}
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="feesPaid"
//                       value="No"
//                       className="mr-2 text-blue-500 focus:ring-blue-300"
//                       required
//                       onChange={handleChange}
//                     />
//                     No
//                   </label>
//                 </div>
//               </div>

//               {form.feesPaid === "Yes" && (
//                 <>
//                   <div>
//                     <label className="block text-lg font-bold text-gray-700 mb-2">
//                       Installment<span className="text-red-500">*</span>
//                     </label>
//                     <div className="flex space-x-6 mt-2">
//                       <label className="flex items-center">
//                         <input
//                           type="radio"
//                           name="installment"
//                           value="Yes"
//                           className="mr-2 text-blue-500 focus:ring-blue-300"
//                           required
//                           onChange={handleChange}
//                         />
//                         Yes
//                       </label>
//                       <label className="flex items-center">
//                         <input
//                           type="radio"
//                           name="installment"
//                           value="No"
//                           className="mr-2 text-blue-500 focus:ring-blue-300"
//                           required
//                           onChange={handleChange}
//                         />
//                         No
//                       </label>
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-lg font-bold text-gray-700 mb-2">
//                       Mode of Payment<span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       name="paymentMode"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white"
//                       onChange={handleChange}
//                       required
//                     >
//                       {paymentOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </>
//               )}
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

//           {/* reCAPTCHA Section */}
//           <section className="mb-8">
//             <div className="flex justify-center">
//               <div className="g-recaptcha" data-sitekey={siteKey}></div>
//             </div>
//             {!recaptchaLoaded && (
//               <p className="text-center text-gray-500 text-sm mt-2">
//                 Loading security verification...
//               </p>
//             )}
//           </section>

//           {/* Submit Button */}
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




































import { useState, useEffect } from "react";
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
    modeOfClass: "",
    feesPaid: "",
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
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  // IMPORTANT: Replace with your actual reCAPTCHA Site Key
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY; // Replace with your key
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Load reCAPTCHA script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js"; 
    script.async = true;
    script.defer = true;
    script.onload = () => setRecaptchaLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const paymentOptions = [
    { value: "", label: "Select Payment Mode" },
    { value: "Cash", label: "Cash" },
    { value: "UPI", label: "UPI" },
    { value: "Net Banking", label: "Net Banking" },
    { value: "Cheque", label: "Cheque" },
  ];

  const medicalOptions = [
    { value: "", label: "Select Medical Status" },
    { value: "N/A", label: "N/A" },
    { value: "Medical Class 1", label: "Medical Class 1" },
    { value: "Medical Class 2", label: "Medical Class 2" },
  ];

  const courseOptions = [
    { value: "", label: "Select Course" },
    { value: "DGCA Ground Classes", label: "DGCA Ground Classes" },
    { value: "ATPL Theory Training", label: "ATPL Theory Training" },
    { value: "Flight Training", label: "Flight Training" },
    { value: "Type Rating", label: "Type Rating" },
    // { value: "Licence Conversion", label: "Licence Conversion" },
    { value: "Mentorship Programme", label: "Mentorship Programme" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "permanentAddress" && sameAddress) {
      setForm((prev) => ({ ...prev, currentAddress: value }));
    }
  };

  const handleSameAddressChange = (e) => {
    const checked = e.target.checked;
    setSameAddress(checked);

    if (checked) {
      setForm((prev) => ({ ...prev, currentAddress: prev.permanentAddress }));
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;

    setFileErrors((prev) => ({ ...prev, [fieldName]: "" }));

    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];

      if (!validTypes.includes(file.type)) {
        const errorMsg = `Only PNG, JPEG, and PDF files are allowed for ${fieldName}`;
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

    // Get reCAPTCHA token
    const token = window.grecaptcha?.getResponse();

    if (!token) {
      setStatus("❌ Please complete the reCAPTCHA verification");
      return;
    }

    setLoading(true);
    setStatus("");

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    Object.keys(files).forEach((key) => formData.append(key, files[key]));
     formData.append("recaptchaToken", token);

    try {
      await Promise.all([
        axios.post(`${API_URL}/api/submit`, formData, {
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
      window.grecaptcha?.reset();
      e.target.reset();
    } catch (err) {
      setStatus(`❌ ${err.response?.data?.error || "Submission failed"}`);
      window.grecaptcha?.reset();
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
            SkyPro Aviation Academy
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
                      "",
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
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Prefer not to say"
                      className="mr-2 text-blue-500 focus:ring-blue-300"
                      required
                      onChange={handleChange}
                    />
                    Prefer not to say
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
                  DGCA Computer Number
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (leave blank if not applicable)
                  </span>
                </label>
                <input
                  name="dgca"
                  placeholder="Enter DGCA number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  eGCA Number
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (leave blank if not applicable)
                  </span>
                </label>
                <input
                  name="egca"
                  placeholder="Enter eGCA number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Medical Status<span className="text-red-500">*</span>
                </label>
                <select
                  name="medical"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white"
                  onChange={handleChange}
                  required
                >
                  {medicalOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
                      "",
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
                      "",
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
                      "",
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
              className="text-2xl font-bold text-gray-900 mb-3 pb-3"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Current Educational Qualification
                </label>

                <select
                  name="classYear"
                  defaultValue=""
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white"
                >
                  <option value="">— Please choose an option —</option>
                  <option value="Class 10">Class 10</option>
                  <option value="12th Appearing">12th Appearing</option>
                  <option value="12th Passed">12th Passed</option>
                  <option value="Graduation 1st Year">Graduation</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Board/University<span className="text-red-500">*</span>
                </label>
                <input
                  name="board"
                  placeholder="CBSE/ICSE/State Board"
                  type="text"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Course Name<span className="text-red-500">*</span>
                </label>
                <select
                  name="course"
                  className="w-[90%] px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white"
                  onChange={handleChange}
                  required
                >
                  {courseOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Mode of Class
                </label>
                <div className="flex space-x-6 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="modeOfClass"
                      value="Online Class"
                      className="mr-2 text-blue-500 focus:ring-blue-300"
                      onChange={handleChange}
                    />
                    Online Class
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="modeOfClass"
                      value="Offline Class"
                      className="mr-2 text-blue-500 focus:ring-blue-300"
                      onChange={handleChange}
                    />
                    Offline Class
                  </label>
                </div>
              </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Fees Paid<span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="feesPaid"
                      value="Yes"
                      className="mr-2 text-blue-500 focus:ring-blue-300"
                      required
                      onChange={handleChange}
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="feesPaid"
                      value="No"
                      className="mr-2 text-blue-500 focus:ring-blue-300"
                      required
                      onChange={handleChange}
                    />
                    No
                  </label>
                </div>
              </div>

              {form.feesPaid === "Yes" && (
                <>
                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-2">
                      Installment<span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-6 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="installment"
                          value="Yes"
                          className="mr-2 text-blue-500 focus:ring-blue-300"
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
                          className="mr-2 text-blue-500 focus:ring-blue-300"
                          required
                          onChange={handleChange}
                        />
                        No
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-2">
                      Mode of Payment<span className="text-red-500">*</span>
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
                </>
              )}
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
              PNG, JPEG, and PDF formats are accepted (Max 2MB per file)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "addressProof", label: "Address Proof" },
                { name: "photo", label: "Passport Size Photo" },
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
                    accept="image/png, image/jpeg, image/jpg, application/pdf"
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

          {/* reCAPTCHA Section */}
          <section className="mb-8">
            <div className="flex justify-center">
              <div className="g-recaptcha" data-sitekey={siteKey}></div>
            </div>
            {!recaptchaLoaded && (
              <p className="text-center text-gray-500 text-sm mt-2">
                Loading security verification...
              </p>
            )}
          </section>

          {/* Submit Button */}
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