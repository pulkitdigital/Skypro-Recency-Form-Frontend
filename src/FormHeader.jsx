export default function FormHeader() {
  return (
    <>
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

      {/* Important Instructions Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-8 mb-8 shadow-lg lg:w-[90%] mx-auto">
        <h3 className="text-2xl font-bold text-red-700 mb-4 flex items-center">
          <span className="text-3xl mr-3">⚠️</span>
          Important Instructions
        </h3>

        <div className="space-y-4 text-gray-800">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-bold text-lg text-gray-900 mb-2">
              1. File Format and Size Requirements
            </h4>
            <p className="leading-relaxed">
              All documents must be uploaded in{" "}
              <span className="font-bold">PDF format</span>, with a {" "}
              <span className="font-bold">maximum
              file size of 2 MB per document. </span>Applicants must compress files using any available online PDF
              compression tool before uploading. <span className="font-bold"> Passport-size photograph and
              signature must be uploaded in JPG or JPEG format only</span> and
              must comply with the size limits specified in the form. <span className="font-bold"> Any file
              uploaded in an incorrect format or exceeding the prescribed size
              limit will not be accepted.</span>
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-bold text-lg text-gray-900 mb-2">
              2. Document Authenticity
            </h4>
            <p className="leading-relaxed">
              Only <span className="font-bold">official documents issued by the foreign FTO </span>will be accepted. All documents must be on
                <span className="font-bold"> official letterhead and duly stamped and signed</span> by the authorised foreign FTO. <span className="font-bold">Documents without a stamp, signature, or official letterhead will be treated as invalid and will lead to
                cancellation of the admission slot.</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
