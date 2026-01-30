import { useState, useEffect } from "react";
import axios from "axios";

export default function ConversionRecencyForm() {
  const initialState = {
    fullName: "",
    dob: "",
    age: "",
    gender: "",
    mobile: "",
    email: "",
    contractingState: "",
    licenseValidity: "",
    licenseEndorsement: "",
    totalSEHours: "",
    totalSEMinutes: "",
    totalMEHours: "",
    totalMEMinutes: "",
    totalHours: "",
    aircraftTypes: "",
    lastFlightDate: "",
    last6MonthsAvailable: "",
    irCheckAircraft: "",
    irCheckDate: "",
    irCheckValidity: "",
    signalReception: "",
    signalReceptionDate: "",
    signalReceptionValidity: "",
    commercialCheckride: "",
    c172CheckrideDate: "",
    c172PICOption: "",
    totalPICExperience: "",
    totalPICXC: "",
    totalInstrumentTime: "",
    medicalValidity: "",
    dgcaExams: {
      airNavigation: false,
      meteorology: false,
      regulations: false,
      technicalGeneral: false,
      technicalSpecific: false,
      compositePaper: false,
    },
    rtrValidity: "",
    frtolUploaded: false,
    policeVerificationDate: "",
    nameChangeProcessed: "",
    hearAboutUs: "",
  };

  const [form, setForm] = useState(initialState);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [fileErrors, setFileErrors] = useState({});
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [sortieRows, setSortieRows] = useState([
    {
      id: 1,
      aircraft: "",
      category: "",
      typeOfFlight: "",
      ldgTo: "",
      hours: "",
      minutes: "",
      dateFlown: "",
      validity: "",
    },
  ]);
  const [dgcaExamDetails, setDgcaExamDetails] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Helper function to convert HH:MM to decimal hours
  const timeToDecimal = (hours, minutes) => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    return h + m / 60;
  };

  // Helper function to convert decimal to HH:MM
  const decimalToTime = (decimal) => {
    const hours = Math.floor(decimal);
    const minutes = Math.round((decimal - hours) * 60);
    return { hours, minutes };
  };

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return "";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Calculate total hours automatically
  useEffect(() => {
    const seHours = parseInt(form.totalSEHours) || 0;
    const seMinutes = parseInt(form.totalSEMinutes) || 0;
    const meHours = parseInt(form.totalMEHours) || 0;
    const meMinutes = parseInt(form.totalMEMinutes) || 0;

    const seTotalDecimal = timeToDecimal(seHours, seMinutes);
    const meTotalDecimal = timeToDecimal(meHours, meMinutes);
    const totalDecimal = seTotalDecimal + meTotalDecimal;

    const { hours, minutes } = decimalToTime(totalDecimal);
    setForm((prev) => ({
      ...prev,
      totalHours: `${hours}:${minutes.toString().padStart(2, "0")}`,
    }));
  }, [
    form.totalSEHours,
    form.totalSEMinutes,
    form.totalMEHours,
    form.totalMEMinutes,
  ]);

  // Calculate age when DOB changes
  useEffect(() => {
    if (form.dob) {
      const age = calculateAge(form.dob);
      setForm((prev) => ({ ...prev, age: age.toString() }));
    }
  }, [form.dob]);

  // Calculate IR Check validity (6 months from date)
  useEffect(() => {
    if (form.irCheckDate) {
      const date = new Date(form.irCheckDate);
      date.setMonth(date.getMonth() + 6);
      setForm((prev) => ({
        ...prev,
        irCheckValidity: date.toISOString().split("T")[0],
      }));
    }
  }, [form.irCheckDate]);

  // Calculate Signal Reception validity (6 months from date)
  useEffect(() => {
    if (form.signalReceptionDate) {
      const date = new Date(form.signalReceptionDate);
      date.setMonth(date.getMonth() + 6);
      setForm((prev) => ({
        ...prev,
        signalReceptionValidity: date.toISOString().split("T")[0],
      }));
    }
  }, [form.signalReceptionDate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("dgcaExams.")) {
      const examName = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        dgcaExams: { ...prev.dgcaExams, [examName]: checked },
      }));

      // Add or remove exam details
      if (checked) {
        setDgcaExamDetails((prev) => [
          ...prev,
          { exam: examName, resultDate: "", validity: "" },
        ]);
      } else {
        setDgcaExamDetails((prev) => prev.filter((d) => d.exam !== examName));
      }
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }
  };

  const validateImageDimensions = (file, fieldName) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);

        // Passport size photo: 35mm x 45mm at 300 DPI = 413 x 531 pixels (approximate)
        // Signature: 140 x 60 pixels (standard digital signature size)
        if (fieldName === "passportPhoto") {
          if (img.width === 413 && img.height === 531) {
            resolve(true);
          } else {
            reject(
              `Passport photo must be exactly 413 x 531 pixels (35mm x 45mm at 300 DPI). Current: ${img.width} x ${img.height} pixels`,
            );
          }
        } else if (
          fieldName === "studentSignature" ||
          fieldName === "finalSignature"
        ) {
          if (img.width === 300 && img.height === 150) {
            resolve(true);
          } else {
            reject(
              `Signature must be exactly 300 x 150 pixels. Current: ${img.width} x ${img.height} pixels`,
            );
          }
        } else {
          resolve(true);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject("Failed to load image");
      };

      img.src = url;
    });
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;

    setFileErrors((prev) => ({ ...prev, [fieldName]: "" }));

    if (file) {
      // File size validation (2MB max)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        const errorMsg = `File size must be less than 2MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
        setFileErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
        setStatus(`❌ ${errorMsg}`);
        e.target.value = "";
        return;
      }

      // File type validation
      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
      ];

      // Only images allowed for photo and signatures
      if (
        fieldName === "passportPhoto" ||
        fieldName === "studentSignature" ||
        fieldName === "finalSignature"
      ) {
        if (!["image/jpeg", "image/jpg"].includes(file.type)) {
          const errorMsg = `Only JPG/JPEG files are allowed for ${fieldName}`;
          setFileErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
          setStatus(`❌ ${errorMsg}`);
          e.target.value = "";
          return;
        }
      } else {
        // Only PDF for all other documents
        if (file.type !== "application/pdf") {
          const errorMsg = `Only PDF files are allowed for ${fieldName}`;
          setFileErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
          setStatus(`❌ ${errorMsg}`);
          e.target.value = "";
          return;
        }
      }

      // Dimension validation for images
      if (
        file.type.startsWith("image/") &&
        (fieldName === "passportPhoto" ||
          fieldName === "studentSignature" ||
          fieldName === "finalSignature")
      ) {
        try {
          await validateImageDimensions(file, fieldName);
        } catch (error) {
          setFileErrors((prev) => ({ ...prev, [fieldName]: error }));
          setStatus(`❌ ${error}`);
          e.target.value = "";
          return;
        }
      }

      setFiles({ ...files, [fieldName]: file });
      setStatus("");
    }
  };

  const addSortieRow = () => {
    setSortieRows([
      ...sortieRows,
      {
        id: Date.now(), // Use timestamp for unique ID
        aircraft: "",
        category: "",
        typeOfFlight: "",
        ldgTo: "",
        hours: "",
        minutes: "",
        dateFlown: "",
        validity: "",
      },
    ]);
  };

  const deleteSortieRow = (id) => {
    if (sortieRows.length > 1) {
      setSortieRows((prev) => prev.filter((row) => row.id !== id));
    }
  };

  const handleSortieChange = (id, field, value) => {
    setSortieRows((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          const updated = { ...row, [field]: value };

          // Calculate validity (6 months from dateFlown)
          if (field === "dateFlown" && value) {
            const date = new Date(value);
            const today = new Date();
            date.setMonth(date.getMonth() + 6);

            if (date < today) {
              updated.validity = "OUT OF RECENCY";
            } else {
              updated.validity = date.toISOString().split("T")[0];
            }
          }

          return updated;
        }
        return row;
      }),
    );
  };

  const calculateSortieSummary = () => {
    let totalDayPIC = 0;
    let totalNightPIC = 0;
    let totalIF = 0;

    sortieRows.forEach((row) => {
      const hours = parseInt(row.hours) || 0;
      const minutes = parseInt(row.minutes) || 0;
      const totalTime = timeToDecimal(hours, minutes);

      if (row.typeOfFlight === "Day PIC") totalDayPIC += totalTime;
      if (row.typeOfFlight === "Night PIC") totalNightPIC += totalTime;
      if (row.typeOfFlight === "IF") totalIF += totalTime;
    });

    return {
      totalDayPIC: decimalToTime(totalDayPIC),
      totalNightPIC: decimalToTime(totalNightPIC),
      totalIF: decimalToTime(totalIF),
    };
  };

  const handleExamDetailChange = (exam, field, value) => {
    setDgcaExamDetails((prev) =>
      prev.map((detail) => {
        if (detail.exam === exam) {
          const updated = { ...detail, [field]: value };

          // Calculate validity (2.5 years from resultDate)
          if (field === "resultDate" && value) {
            const date = new Date(value);
            date.setFullYear(date.getFullYear() + 2);
            date.setMonth(date.getMonth() + 6);
            updated.validity = date.toISOString().split("T")[0];
          }

          return updated;
        }
        return detail;
      }),
    );
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!disclaimerAccepted || !declarationAccepted) {
      setStatus("❌ Please accept both disclaimer and declaration to proceed");
      return;
    }

    setLoading(true);
    setStatus("");

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "dgcaExams") {
        formData.append(key, JSON.stringify(form[key]));
      } else {
        formData.append(key, form[key]);
      }
    });
    formData.append("sortieRows", JSON.stringify(sortieRows));
    formData.append("dgcaExamDetails", JSON.stringify(dgcaExamDetails));

    Object.keys(files).forEach((key) => formData.append(key, files[key]));

    try {
      await Promise.all([
        axios.post(`${API_URL}/api/submit-conversion`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
        delay(5000),
      ]);

      setStatus("✅ Form submitted successfully");
      setForm(initialState);
      setFiles({});
      setFileErrors({});
      setDisclaimerAccepted(false);
      setDeclarationAccepted(false);
      setSortieRows([
        {
          id: Date.now(),
          aircraft: "",
          category: "",
          typeOfFlight: "",
          ldgTo: "",
          hours: "",
          minutes: "",
          dateFlown: "",
          validity: "",
        },
      ]);
      setDgcaExamDetails([]);
      e.target.reset();
    } catch (err) {
      setStatus(`❌ ${err.response?.data?.error || "Submission failed"}`);
    } finally {
      setLoading(false);
    }
  };

  const sortieSummary = calculateSortieSummary();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-5xl font-bold mb-2"
            style={{ color: "black" }}
          >
            Conversion and Recency Admission Form
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

          {/* 1. Personal Details */}
          <section className="mb-12">
            <h3
              className="text-2xl font-bold mb-6 pb-3 inline-block border-b-2"
              style={{ color: "#003366", borderColor: "#003366" }}
            >
              1. Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Full Name (as per official records)
                  <span className="text-red-500">*</span>
                </label>
                <input
                  name="fullName"
                  value={form.fullName}
                  placeholder="Enter full name"
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
                  value={form.dob}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
                {form.age && form.age !== "0" && (
                  <p className="text-sm text-gray-700 mt-1 font-semibold">
                    Age: {form.age} years
                  </p>
                )}
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
                  Mobile Number (WhatsApp)
                  <span className="text-red-500">*</span>
                </label>
                <input
                  name="mobile"
                  value={form.mobile}
                  type="tel"
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
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
                  Email ID<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Passport Size Photo (413 x 531 pixels)
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="passportPhoto"
                  accept="image/jpeg, image/jpg"
                  className={`w-full px-4 py-3 border-2 border-dashed rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
                    fileErrors.passportPhoto
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300"
                  }`}
                  required
                  onChange={handleFile}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Required dimensions: 413 x 531 pixels (35mm x 45mm at 300
                  DPI), JPG/JPEG only, Max 2MB
                </p>
                <a
                  href="https://www.reduceimages.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm mt-1 inline-block hover:underline"
                >
                  Click here to resize your photo
                </a>
                {fileErrors.passportPhoto && (
                  <p className="text-red-600 text-sm mt-1">
                    {fileErrors.passportPhoto}
                  </p>
                )}
                {files.passportPhoto && !fileErrors.passportPhoto && (
                  <p className="text-green-600 text-sm mt-1">
                    ✓ {files.passportPhoto.name}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 2. License Details */}
          <section className="mb-12">
            <h3
              className="text-2xl font-bold mb-6 pb-3 inline-block border-b-2"
              style={{ color: "#003366", borderColor: "#003366" }}
            >
              2. License Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Which Contracting State License do You Hold?
                  <span className="text-red-500">*</span>
                </label>
                <input
                  name="contractingState"
                  value={form.contractingState}
                  placeholder="Enter country name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  License Validity Date<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="licenseValidity"
                  value={form.licenseValidity}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  License Endorsement<span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="licenseEndorsement"
                      value="SE IR"
                      className="mr-2 text-blue-500 focus:ring-blue-300"
                      required
                      onChange={handleChange}
                    />
                    SE IR
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="licenseEndorsement"
                      value="SE ME IR"
                      className="mr-2 text-blue-500 focus:ring-blue-300"
                      required
                      onChange={handleChange}
                    />
                    SE ME IR
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Upload Foreign License<span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="foreignLicense"
                  accept="application/pdf"
                  className={`w-full px-4 py-3 border-2 border-dashed rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
                    fileErrors.foreignLicense
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300"
                  }`}
                  required
                  onChange={handleFile}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Only PDF files allowed, less than 2MB
                </p>
                {fileErrors.foreignLicense && (
                  <p className="text-red-600 text-sm mt-1">
                    {fileErrors.foreignLicense}
                  </p>
                )}
                {files.foreignLicense && !fileErrors.foreignLicense && (
                  <p className="text-green-600 text-sm mt-1">
                    ✓ {files.foreignLicense.name}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 3. Flying Experience */}
          <section className="mb-12">
            <h3
              className="text-2xl font-bold mb-6 pb-3 inline-block border-b-2"
              style={{ color: "#003366", borderColor: "#003366" }}
            >
              3. Total Flying Hours
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  SE (HH:MM)<span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    name="totalSEHours"
                    type="number"
                    min="0"
                    placeholder="HH"
                    value={form.totalSEHours}
                    className="w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                    onChange={handleChange}
                  />
                  <span className="flex items-center">:</span>
                  <input
                    name="totalSEMinutes"
                    type="number"
                    min="0"
                    max="59"
                    placeholder="MM"
                    value={form.totalSEMinutes}
                    className="w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>

              {form.licenseEndorsement === "SE ME IR" && (
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    ME (HH:MM)<span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      name="totalMEHours"
                      type="number"
                      min="0"
                      placeholder="HH"
                      value={form.totalMEHours}
                      className="w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      required
                      onChange={handleChange}
                    />
                    <span className="flex items-center">:</span>
                    <input
                      name="totalMEMinutes"
                      type="number"
                      min="0"
                      max="59"
                      placeholder="MM"
                      value={form.totalMEMinutes}
                      className="w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      required
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Total
                </label>
                <input
                  name="totalHours"
                  type="text"
                  value={form.totalHours}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100"
                  disabled
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Aircraft Types Flown (Mention All)
                  <span className="text-red-500">*</span>
                </label>
                <input
                  name="aircraftTypes"
                  value={form.aircraftTypes}
                  placeholder="e.g., C172, C152, PA28"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Date of Last Flight<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="lastFlightDate"
                  value={form.lastFlightDate}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* 4. Last 6 Months Flying Experience */}
          <section className="mb-12">
            <h3
              className="text-2xl font-bold mb-6 pb-3 inline-block border-b-2"
              style={{ color: "#003366", borderColor: "#003366" }}
            >
              4. Last 6 Months of Flying Experience
            </h3>
            <div className="mb-6">
              <label className="block text-lg font-bold text-gray-700 mb-2">
                Last 6 Months of Flying Experience Available?
                <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-6 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="last6MonthsAvailable"
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
                    name="last6MonthsAvailable"
                    value="No"
                    className="mr-2 text-blue-500 focus:ring-blue-300"
                    required
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>

            {form.last6MonthsAvailable === "Yes" && (
              <>
                {/* Sortie Details Table */}
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">
                    Last 6 Months Sortie Wise Details
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2">
                            Aircraft
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            SE/ME
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            Type of Flight
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            LDG/TO
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            Hours
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            Minutes
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            Date Flown
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            Validity
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortieRows.map((row) => (
                          <tr key={row.id}>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="text"
                                value={row.aircraft}
                                onChange={(e) =>
                                  handleSortieChange(
                                    row.id,
                                    "aircraft",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <select
                                value={row.category}
                                onChange={(e) =>
                                  handleSortieChange(
                                    row.id,
                                    "category",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                              >
                                <option value="">Select</option>
                                <option value="SE">SE</option>
                                <option value="ME">ME</option>
                              </select>
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <select
                                value={row.typeOfFlight}
                                onChange={(e) =>
                                  handleSortieChange(
                                    row.id,
                                    "typeOfFlight",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                              >
                                <option value="">Select</option>
                                <option value="Dual">Dual</option>
                                <option value="Day PIC">Day PIC</option>
                                <option value="Night PIC">Night PIC</option>
                                <option value="IF">IF</option>
                              </select>
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="text"
                                value={row.ldgTo}
                                onChange={(e) =>
                                  handleSortieChange(
                                    row.id,
                                    "ldgTo",
                                    e.target.value,
                                  )
                                }
                                disabled={row.typeOfFlight !== "Night PIC"}
                                placeholder="LDG__ T/O__"
                                className="w-full px-2 py-1 border border-gray-300 rounded disabled:bg-gray-100"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="number"
                                min="0"
                                max="999"
                                value={row.hours}
                                onChange={(e) =>
                                  handleSortieChange(
                                    row.id,
                                    "hours",
                                    e.target.value,
                                  )
                                }
                                placeholder="HH"
                                className="w-full px-2 py-1 border border-gray-300 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="number"
                                min="0"
                                max="59"
                                value={row.minutes}
                                onChange={(e) =>
                                  handleSortieChange(
                                    row.id,
                                    "minutes",
                                    e.target.value,
                                  )
                                }
                                placeholder="MM"
                                className="w-full px-2 py-1 border border-gray-300 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="date"
                                value={row.dateFlown}
                                onChange={(e) =>
                                  handleSortieChange(
                                    row.id,
                                    "dateFlown",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="text"
                                value={row.validity}
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-100 text-sm"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2 text-center">
                              {sortieRows.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => deleteSortieRow(row.id)}
                                  className="text-red-600 hover:text-red-800 font-bold text-xl"
                                  title="Delete row"
                                >
                                  ✕
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    type="button"
                    onClick={addSortieRow}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add One More Row
                  </button>

                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-bold text-lg mb-2">Summary</h5>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="font-semibold">Total Day PIC:</p>
                        <p>
                          {sortieSummary.totalDayPIC.hours} hrs{" "}
                          {sortieSummary.totalDayPIC.minutes} min
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Total Night PIC:</p>
                        <p>
                          {sortieSummary.totalNightPIC.hours} hrs{" "}
                          {sortieSummary.totalNightPIC.minutes} min
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">
                          Total Instrument Flying:
                        </p>
                        <p>
                          {sortieSummary.totalIF.hours} hrs{" "}
                          {sortieSummary.totalIF.minutes} min
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* IR Check */}
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">
                    IR Check
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-2">
                        Aircraft Flown<span className="text-red-500">*</span>
                      </label>
                      <input
                        name="irCheckAircraft"
                        value={form.irCheckAircraft}
                        placeholder="Enter aircraft type"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300"
                        required
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-2">
                        Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="irCheckDate"
                        value={form.irCheckDate}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300"
                        required
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-2">
                        Validity
                      </label>
                      <input
                        type="text"
                        value={form.irCheckValidity}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-2">
                        Upload CA-40 IR Performa
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        name="ca40IR"
                        accept="application/pdf"
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl"
                        required
                        onChange={handleFile}
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        Only PDF files allowed, less than 2MB
                      </p>
                      <a
                        href="https://imgv2-1-f.scribdassets.com/img/document/405053233/original/22c2fe1893/1?v=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm inline-block"
                      >
                        Example CA-40
                      </a>
                    </div>
                  </div>
                </div>

                {/* Signal Reception Test */}
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">
                    Signal Reception Test
                  </h4>
                  <div className="mb-4">
                    <label className="block text-lg font-bold text-gray-700 mb-2">
                      Completed?<span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="signalReception"
                          value="Yes"
                          className="mr-2"
                          required
                          onChange={handleChange}
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="signalReception"
                          value="No"
                          className="mr-2"
                          required
                          onChange={handleChange}
                        />
                        No
                      </label>
                    </div>
                  </div>

                  {form.signalReception === "Yes" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-2">
                          Date<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="signalReceptionDate"
                          value={form.signalReceptionDate}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                          required
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-2">
                          Validity
                        </label>
                        <input
                          type="text"
                          value={form.signalReceptionValidity}
                          disabled
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-2">
                          Upload Signal Reception Test
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          name="signalReceptionTest"
                          accept="application/pdf"
                          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl"
                          required
                          onChange={handleFile}
                        />
                        <p className="text-sm text-gray-600 mt-1">
                          Only PDF files allowed, less than 2MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>

          {/* 5. Commercial Checkride */}
          <section className="mb-12">
            <h3
              className="text-2xl font-bold mb-6 pb-3 inline-block border-b-2"
              style={{ color: "#003366", borderColor: "#003366" }}
            >
              5. Commercial Checkride
            </h3>
            <div className="mb-6">
              <label className="block text-lg font-bold text-gray-700 mb-2">
                Checkride Type<span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="commercialCheckride"
                    value="C172"
                    className="mr-2"
                    required
                    onChange={handleChange}
                  />
                  C172
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="commercialCheckride"
                    value="Other Than C172"
                    className="mr-2"
                    required
                    onChange={handleChange}
                  />
                  Other Than C172
                </label>
              </div>
            </div>

            {form.commercialCheckride === "C172" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    Date of Checkride<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="c172CheckrideDate"
                    value={form.c172CheckrideDate}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    Upload C172 Commercial Checkride Statement
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="c172CheckrideStatement"
                    accept="application/pdf"
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl"
                    required
                    onChange={handleFile}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Only PDF files allowed, less than 2MB
                  </p>
                </div>
              </div>
            )}

            {form.commercialCheckride === "Other Than C172" && (
              <div className="mb-6">
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Select One<span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="radio"
                      name="c172PICOption"
                      value="10hrs"
                      className="mr-3 mt-1"
                      required
                      onChange={handleChange}
                    />
                    <span>I have 10 hrs PIC on C172 in the last 24 Months</span>
                  </label>
                  <label className="flex items-start">
                    <input
                      type="radio"
                      name="c172PICOption"
                      value="flightReview"
                      className="mr-3 mt-1"
                      required
                      onChange={handleChange}
                    />
                    <span>
                      I have given a Flight review/Check ride/Flight Test/Skill
                      Tests (any one) on C172 in the last 24 Months
                    </span>
                  </label>
                  <label className="flex items-start">
                    <input
                      type="radio"
                      name="c172PICOption"
                      value="neither"
                      className="mr-3 mt-1"
                      required
                      onChange={handleChange}
                    />
                    <span>
                      I don't have 10 hrs PIC or given a Flight review/Check
                      ride/Flight Test/Skill Tests (any one) on C172 in the last
                      24 Months
                    </span>
                  </label>
                </div>

                {form.c172PICOption === "flightReview" && (
                  <div className="mt-4">
                    <label className="block text-lg font-bold text-gray-700 mb-2">
                      Upload Flight review/Check ride/Flight Test/Skill Tests on
                      C172<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      name="c172FlightReview"
                      accept="application/pdf"
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl"
                      required
                      onChange={handleFile}
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Only PDF files allowed, less than 2MB
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* 6. PIC Experience */}
          <section className="mb-12">
            <h3
              className="text-2xl font-bold mb-6 pb-3 inline-block border-b-2"
              style={{ color: "#003366", borderColor: "#003366" }}
            >
              6. PIC Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Total PIC Experience<span className="text-red-500">*</span>
                </label>
                <input
                  name="totalPICExperience"
                  value={form.totalPICExperience}
                  type="number"
                  placeholder="Enter hours"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Upload 100 hrs PIC Statement
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="pic100Statement"
                  accept="application/pdf"
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl"
                  required
                  onChange={handleFile}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Only PDF files allowed, less than 2MB
                </p>
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Upload 300 nm XC Statement
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="xc300Statement"
                  accept="application/pdf"
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl"
                  required
                  onChange={handleFile}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Only PDF files allowed, less than 2MB
                </p>
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Total PIC Cross-country Experience
                  <span className="text-red-500">*</span>
                </label>
                <input
                  name="totalPICXC"
                  value={form.totalPICXC}
                  type="number"
                  placeholder="Enter hours"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Upload Total PIC Cross-country Statement
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="picXCStatement"
                  accept="application/pdf"
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl"
                  required
                  onChange={handleFile}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Only PDF files allowed, less than 2MB
                </p>
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Total Instrument Time<span className="text-red-500">*</span>
                </label>
                <input
                  name="totalInstrumentTime"
                  value={form.totalInstrumentTime}
                  type="number"
                  placeholder="Enter hours"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Upload Total Instrument Time Statement
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="instrumentTimeStatement"
                  accept="application/pdf"
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl"
                  required
                  onChange={handleFile}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Only PDF files allowed, less than 2MB
                </p>
              </div>
            </div>
          </section>

          {/* 7. Medical & Exams */}
          <section className="mb-12">
            <h3
              className="text-2xl font-bold mb-6 pb-3 inline-block border-b-2"
              style={{ color: "#003366", borderColor: "#003366" }}
            >
              7. DGCA Class-1 Medical Assessment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Validity<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="medicalValidity"
                  value={form.medicalValidity}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Upload DGCA Class-1 Medical Assessment
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="medicalAssessment"
                  accept="application/pdf"
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl"
                  required
                  onChange={handleFile}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Only PDF files allowed, less than 2MB
                </p>
                <p className="text-sm text-red-600 mt-1">
                  *Note - Please do Not Upload the CA-35 Form/Class-2 Medical
                </p>
              </div>
            </div>

            <h4 className="text-xl font-bold text-gray-800 mb-4">
              DGCA Exams Cleared
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { key: "airNavigation", label: "Air Navigation" },
                { key: "meteorology", label: "Meteorology" },
                { key: "regulations", label: "Regulations" },
                { key: "technicalGeneral", label: "Technical General" },
                { key: "technicalSpecific", label: "Technical Specific" },
                {
                  key: "compositePaper",
                  label: "Composite Paper (Meteorology + Navigation)",
                },
              ].map((exam) => (
                <label key={exam.key} className="flex items-center">
                  <input
                    type="checkbox"
                    name={`dgcaExams.${exam.key}`}
                    checked={form.dgcaExams[exam.key]}
                    onChange={handleChange}
                    className="mr-3 w-5 h-5"
                  />
                  <span className="font-medium">{exam.label}</span>
                </label>
              ))}
            </div>

            {dgcaExamDetails.length > 0 && (
              <div className="mt-6">
                <h5 className="text-lg font-bold mb-4">Exam Details</h5>
                {dgcaExamDetails.map((detail) => (
                  <div
                    key={detail.exam}
                    className="mb-6 p-4 border border-gray-300 rounded-xl"
                  >
                    <h6 className="font-bold mb-3 capitalize">
                      {detail.exam.replace(/([A-Z])/g, " $1").trim()}
                    </h6>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-semibold mb-2">
                          Exam Result Date
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={detail.resultDate}
                          onChange={(e) =>
                            handleExamDetailChange(
                              detail.exam,
                              "resultDate",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">
                          Validity
                        </label>
                        <input
                          type="text"
                          value={detail.validity}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">
                          Upload Proof<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          name={`dgcaExam_${detail.exam}`}
                          accept="application/pdf"
                          className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg"
                          required
                          onChange={handleFile}
                        />
                        <p className="text-sm text-gray-600 mt-1">
                          Only PDF files allowed, less than 2MB
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> As per DGCA CAR-7, Series B Part-I,
                    Point 6.7, for the issuance of SPL, DGCA exam validity
                    should be within a period of 2.5 years.
                  </p>
                  <ul className="text-sm text-gray-700 dotted ml-6 mt-2 list-disc">
                    <li>To get Exam Result Date,</li>
                    <li>Log in to your eGCA portal</li>
                    <li>Click “CPL” on the left menu</li>
                    <li>Go to the Examination Details</li>
                  </ul>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>
                      To share the DGCA exam expiry, please follow these steps:
                    </strong>
                  </p>
                  <ol className="text-sm text-gray-700 list-decimal ml-6 mt-2">
                    <li>
                      Log in to your Pariksha Portal (
                      <a
                        href="https://pariksha.dgca.gov.in/home"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        https://pariksha.dgca.gov.in/home
                      </a>
                      )
                    </li>
                    <li>
                      On the left side, go to view details, then to Candidate
                      Exam History FC
                    </li>
                    <li>Enter your session details and generate a report</li>
                    <li>
                      You will then see an option to "export as PDF", click it
                    </li>
                    <li>You have now downloaded the DGCA examination proof</li>
                  </ol>
                </div>
              </div>
            )}
          </section>

          {/* 8. Additional Documents */}
          <section className="mb-12">
            <h3
              className="text-2xl font-bold mb-6 pb-3 inline-block border-b-2"
              style={{ color: "#003366", borderColor: "#003366" }}
            >
              8. Additional Documents
            </h3>

            {/* GRID START */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload RTR */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Upload RTR<span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="rtr"
                  accept="application/pdf"
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl"
                  required
                  onChange={handleFile}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Only PDF files allowed, less than 2MB
                </p>
              </div>

              {/* RTR Validity */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  RTR Validity<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="rtrValidity"
                  value={form.rtrValidity}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  required
                  onChange={handleChange}
                />
              </div>

              {/* Upload FRTOL */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Upload FRTOL<span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="frtol"
                  accept="application/pdf"
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl"
                  required
                  onChange={handleFile}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Only PDF files allowed, less than 2MB
                </p>
              </div>

              {/* EMPTY COLUMN — desktop only */}
              <div className="hidden md:block"></div>

              {/* Police Verification Date */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Date of Police Verification
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="policeVerificationDate"
                  value={form.policeVerificationDate}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  required
                  onChange={handleChange}
                />
              </div>

              {/* Upload Police Verification */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Upload Police Verification
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="policeVerification"
                  accept="application/pdf"
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl"
                  required
                  onChange={handleFile}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Only PDF files allowed, less than 2MB
                </p>
              </div>

              {/* 10th Marksheet */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Upload 10th Marksheet<span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="marksheet10"
                  accept="application/pdf"
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl"
                  required
                  onChange={handleFile}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Only PDF files allowed, less than 2MB
                </p>
              </div>

              {/* 12th Marksheet */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Upload 12th Marksheet<span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="marksheet12"
                  accept="application/pdf"
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl"
                  required
                  onChange={handleFile}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Only PDF files allowed, less than 2MB
                </p>
              </div>
            </div>
            {/* GRID END */}

            {/* Name Change Section */}
            <div className="mt-6">
              <label className="block text-lg font-bold text-gray-700 mb-2">
                Have You Processed Name Change Certificate?
                <span className="text-red-500">*</span>
              </label>

              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="nameChangeProcessed"
                    value="Yes"
                    className="mr-2"
                    required
                    onChange={handleChange}
                  />
                  Yes
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="nameChangeProcessed"
                    value="No"
                    className="mr-2"
                    required
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>

            {form.nameChangeProcessed === "Yes" && (
              <div className="mt-4">
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Upload Name Change Certificate
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="nameChangeCertificate"
                  accept="application/pdf"
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl "
                  required
                  onChange={handleFile}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Only PDF files allowed, less than 2MB
                </p>
              </div>
            )}
          </section>

          {/* 9. Self Declaration */}
          <section className="mb-12">
            <h3
              className="text-2xl font-bold mb-6 pb-3 inline-block border-b-2"
              style={{ color: "#003366", borderColor: "#003366" }}
            >
              9. Self Declaration
            </h3>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-6">
              <label className="flex items-start mt-4">
                <input
                  type="checkbox"
                  checked={disclaimerAccepted}
                  onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                  className="mt-1 mr-3 w-5 h-5 text-blue-500 focus:ring-blue-300 flex-shrink-0"
                  required
                />
                <span className="text-gray-800 font-medium mb-4">
                  I understand and acknowledge that SkyPro Aviation’s partner
                  Flying Training Organisations (FTOs) are DGCA-approved and
                  operate in accordance with DGCA training and safety standards.
                  I further understand that flying training involves inherent
                  risks. Having fully understood these risks, I voluntarily
                  undertake sole responsibility for my safety and for any
                  incident or accident that may occur during flight training for
                  license conversion or recency, and I agree that SkyPro
                  Aviation shall not be held responsible or liable in any
                  manner. I further understand and agree that if I fail to
                  perform satisfactorily during any checks, fail to obtain solo
                  release in the first attempt, or if there is any delay arising
                  due to my performance, skill level, preparedness, or
                  competency, then the 7-day commitment and 15-day completion
                  guarantee provided by SkyPro Aviation shall no longer be
                  applicable. Any additional training, time, or costs resulting
                  from such performance-related delays shall be my sole
                  responsibility.
                  <span className="text-red-500">*</span>
                </span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold mb-2">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2">
                    Student Signature (Digital - 300 x 150 pixels)
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="studentSignature"
                    accept="image/jpeg, image/jpg"
                    className={`w-full px-4 py-3 border-2 border-dashed rounded-xl ${
                      fileErrors.studentSignature
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                    onChange={handleFile}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Required dimensions: 300 x 150 pixels, JPG/JPEG only, Max
                    2MB
                  </p>
                  <a
                    href="https://www.reduceimages.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm mt-1 inline-block hover:underline"
                  >
                    Click here to resize your signature
                  </a>
                  {fileErrors.studentSignature && (
                    <p className="text-red-600 text-sm mt-1">
                      {fileErrors.studentSignature}
                    </p>
                  )}
                  {files.studentSignature && !fileErrors.studentSignature && (
                    <p className="text-green-600 text-sm mt-1">
                      ✓ {files.studentSignature.name}
                    </p>
                  )}
                </div>
                <div className="md:-mt-16">
                  <label className="block font-bold mb-2">Date</label>
                  <input
                    type="text"
                    value={new Date().toLocaleDateString("en-GB")}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 10. How Did You Hear About Us */}
          <section className="mb-12">
            <h3
              className="text-2xl font-bold mb-6 pb-3 inline-block border-b-2"
              style={{ color: "#003366", borderColor: "#003366" }}
            >
              10. How Did You Hear About SkyPro Aviation?
            </h3>
            <input
              name="hearAboutUs"
              value={form.hearAboutUs}
              placeholder="e.g., Social Media, Friend, Website, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300"
              onChange={handleChange}
            />
          </section>

          {/* 11. Final Declaration */}
          <section className="mb-8">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Declaration
              </h3>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={declarationAccepted}
                  onChange={(e) => setDeclarationAccepted(e.target.checked)}
                  className="mt-1 mr-3 w-5 h-5 text-blue-500 focus:ring-blue-300 flex-shrink-0"
                  required
                />
                <span className="text-gray-800 font-medium mb-4">
                  I confirm that all the information provided above is true and
                  correct to the best of my knowledge. I understand that
                  incomplete or incorrect information may delay my admission and
                  training process.
                  <span className="text-red-500">*</span>
                </span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block font-bold mb-2">Candidate Name</label>
                  <input
                    type="text"
                    value={form.fullName}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2">
                    Signature (Digital - 300 x 150 pixels)
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="finalSignature"
                    accept="image/jpeg, image/jpg"
                    className={`w-full px-4 py-3 border-2 border-dashed rounded-xl ${
                      fileErrors.finalSignature
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                    onChange={handleFile}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Required dimensions: 300 x 150 pixels, JPG/JPEG only, Max
                    2MB
                  </p>
                  <a
                    href="https://www.reduceimages.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm mt-1 inline-block hover:underline"
                  >
                    Click here to resize your signature
                  </a>
                  {fileErrors.finalSignature && (
                    <p className="text-red-600 text-sm mt-1">
                      {fileErrors.finalSignature}
                    </p>
                  )}
                  {files.finalSignature && !fileErrors.finalSignature && (
                    <p className="text-green-600 text-sm mt-1">
                      ✓ {files.finalSignature.name}
                    </p>
                  )}
                </div>
                <div className="md:-mt-16">
                  <label className="block font-bold mb-2">Date</label>
                  <input
                    type="text"
                    value={new Date().toLocaleDateString("en-GB")}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !disclaimerAccepted || !declarationAccepted}
            className="w-full bg-[#003366] hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-xl hover:shadow-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-500"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
