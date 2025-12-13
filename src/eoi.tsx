import React, { useEffect, useState } from "react";

interface FormValues {
  // Step 0
  userType: string;
  name: string;
  email: string;
  mobile: string;
  pan: string;
  aadhaar: string;
  address: string;
  city: string;

  // Step 1
  preference: string;
  source: string;
  agentName?: string;
  agentMobile?: string;
  agentRERA?: string;

  // Step 2
  accountHolder?: string;
  chequeNo?: string;
  bankBranch?: string;
  instrumentDate?: string;

  // Step 3
  aadhaarFile?: File | null;
  panFile?: File | null;
  userPhoto?: File | null;
  signature?: File | null;
  chequePhoto?: File | null;
  reraCertificate?: File | null;

  // Step 4
  declarationAccepted?: boolean;
  declarationName?: string;
  declarationLocation?: string;
  declarationDate?: string;
}

const steps = [
  "Personal Info",
  "Unit Preference",
  "Payment Details",
  "Upload Documents",
  "Declaration",
];

const EOIForm = () => {
  const [step, setStep] = useState(0);
  const [ip, setIp] = useState("Fetching...");
  const [loading, setLoading] = useState(false);
  const [eoiId, setEoiId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormValues>({
    userType: "",
    name: "",
    email: "",
    mobile: "",
    pan: "",
    aadhaar: "",
    address: "",
    city: "",
    preference: "",
    source: "",
    agentName: "",
    agentMobile: "",
    agentRERA: "",
    accountHolder: "",
    chequeNo: "",
    bankBranch: "",
    instrumentDate: "",
    aadhaarFile: null,
    panFile: null,
    userPhoto: null,
    signature: null,
    chequePhoto: null,
    reraCertificate: null,
    declarationAccepted: false,
    declarationName: "",
    declarationLocation: "",
    declarationDate: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((data) => setIp(data.ip || "Unknown"))
      .catch(() => setIp("Unable to fetch"));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked, files } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? (files ? files[0] : null) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 0) {
      if (!formData.userType) newErrors.userType = "Please select user type";
      if (!formData.name.trim()) newErrors.name = "Full name is required";
      if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = "Enter a valid email";
      if (!formData.mobile.match(/^[6-9]\d{9}$/)) newErrors.mobile = "Valid 10-digit mobile required";
      if (!formData.pan.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)) newErrors.pan = "Invalid PAN format";
      // if (!formData.aadhaar.match(/^\d{12}$/)) newErrors.aadhaar = "Aadhaar must be 12 digits";
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
    }

    if (step === 1) {
      if (!formData.preference) newErrors.preference = "Please select unit preference";
      if (!formData.source) newErrors.source = "Please select source";
      if (formData.source === "real-estate-agent") {
        if (!formData.agentName?.trim()) newErrors.agentName = "Agent name required";
        if (formData.agentMobile && !formData.agentMobile.match(/^[6-9]\d{9}$/))
          newErrors.agentMobile = "Valid 10-digit mobile required";
        if (!formData.agentRERA?.trim()) newErrors.agentRERA = "RERA number required";
      }
    }

    if (step === 2) {
      if (!formData.accountHolder?.trim()) newErrors.accountHolder = "Account holder name required";
      if (!formData.chequeNo?.trim()) newErrors.chequeNo = "Cheque number required";
      if (!formData.bankBranch?.trim()) newErrors.bankBranch = "Bank & branch required";
      if (!formData.instrumentDate) newErrors.instrumentDate = "Instrument date required";
    }

    if (step === 3) {
      if (!formData.aadhaarFile) newErrors.aadhaarFile = "Aadhaar document required";
      if (!formData.panFile) newErrors.panFile = "PAN document required";
      if (!formData.userPhoto) newErrors.userPhoto = "Your photo is required";
      if (!formData.signature) newErrors.signature = "Signature required";
      if (formData.userType === "broker" && !formData.reraCertificate)
        newErrors.reraCertificate = "RERA certificate required for brokers";
    }

    if (step === 4) {
      if (!formData.declarationAccepted) newErrors.declarationAccepted = "You must accept the declaration";
      if (!formData.declarationName?.trim()) newErrors.declarationName = "Name required";
      if (!formData.declarationLocation?.trim()) newErrors.declarationLocation = "Location required";
      if (!formData.declarationDate) newErrors.declarationDate = "Date required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const nextStep = () => {
  //   if (validateStep() && step < 4) {
  //     setStep(step + 1);
  //   }
  // };

  const prevStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true)

    if (step === 0) {
      const res = await fetch("https://sar.ecis.in/api/suncity/eoi/step1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setEoiId(data.eoiId);
      setStep(1);
      setLoading(false);
      return;
    }

    if (step === 1 && eoiId) {
      await fetch("https://sar.ecis.in/api/suncity/eoi/step2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eoiId, ...formData })
      });
      setStep(2);
      setLoading(false);
      return;
    }

    if (step === 2 && eoiId) {
      await fetch("https://sar.ecis.in/api/suncity/eoi/step3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eoiId, ...formData })
      });
      setStep(3);
      setLoading(false);
      return;
    }

    if (step === 3 && eoiId) {
      const form = new FormData();
      form.append("eoiId", String(eoiId));
      if (formData.aadhaarFile) form.append("aadhaarFile", formData.aadhaarFile);
      if (formData.panFile) form.append("panFile", formData.panFile);
      if (formData.userPhoto) form.append("userPhoto", formData.userPhoto);
      if (formData.signature) form.append("signature", formData.signature);
      await fetch("https://sar.ecis.in/api/suncity/eoi/documents", {
        method: "POST",
        body: form
      });
      setStep(4);
      setLoading(false);
      return;
    }

    if (step === 4 && eoiId) {
      await fetch("https://sar.ecis.in/api/suncity/eoi/declaration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eoiId, ...formData })
      });

      await fetch("https://sar.ecis.in/api/suncity/eoi/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eoiId,
          ip,
        })
      });
      setLoading(false);

      alert("Thank you! Your Expression of Interest has been submitted successfully.");
    }
  };

  return (
    <>
    <div className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <img src="https://www.suncityprojects.com/images/logo.svg" alt="Company Logo" className="h-12 w-auto" />
        </div>
        <div>
          <img src="/visitor/logo.png" alt="Project Logo" className="h-20 w-auto" />
        </div>
        {/* <div className="text-gray-600 text-sm">
          Your IP: {ip}
        </div> */}
      </div>
    </div>
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center justify-center max-w-5xl mx-auto">
            {steps.map((label, i) => (
              <div key={i} className="flex items-center justify-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-all ${
                    i <= step ? "bg-suncity-brown" : "bg-gray-300"
                  }`}
                >
                  {i + 1}
                </div>
                <div className="hidden sm:block ml-3 text-xs font-medium text-gray-700">
                  {label}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 transition-all ${
                      i < step ? "bg-suncity-brown" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 lg:p-12">
            {step === 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Applicant Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      User Type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-6">
                      <label
                        className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-all
                        ${formData.userType === "individual"
                          ? "border-indigo-600 bg-indigo-50 shadow-sm"
                          : "border-gray-300 bg-white hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="userType"
                          value="individual"
                          checked={formData.userType === "individual"}
                          onChange={handleChange}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-gray-800 font-medium">Individual</span>
                      </label>
                      <label
                        className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-all
                        ${formData.userType === "broker"
                          ? "border-indigo-600 bg-indigo-50 shadow-sm"
                          : "border-gray-300 bg-white hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="userType"
                          value="broker"
                          checked={formData.userType === "broker"}
                          onChange={handleChange}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-gray-800 font-medium">Broker / Agent</span>
                      </label>

                    </div>
                    {errors.userType && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{errors.userType}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                      placeholder="Enter full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile *</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                      placeholder="98XXXXXXXX"
                    />
                    {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN *</label>
                    <input
                      type="text"
                      name="pan"
                      value={formData.pan}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg uppercases:border-suncity-brown uppercase"
                      placeholder="ABCDE1234F"
                    />
                    {errors.pan && <p className="text-red-500 text-sm mt-1">{errors.pan}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar (Last 4 digits optional)</label>
                    <input
                      type="text"
                      name="aadhaar"
                      value={formData.aadhaar}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                      placeholder="XXXX"
                      maxLength={4}
                    />
                    {errors.aadhaar && <p className="text-red-500 text-sm mt-1">{errors.aadhaar}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                      placeholder="Full residential address"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                      placeholder="e.g. Mumbai"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Unit Preference & Source</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Unit *</label>
                    <select
                      name="preference"
                      value={formData.preference}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                    >
                      <option value="">Select unit type</option>
                      <option value="3bhk">3 BHK</option>
                      <option value="4bhk">4 BHK</option>
                    </select>
                    {errors.preference && <p className="text-red-500 text-sm mt-1">{errors.preference}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">How did you hear about us? *</label>
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                    >
                      <option value="">Select source</option>
                      <option value="direct">Direct / Website</option>
                      <option value="social-media">Social Media</option>
                      <option value="real-estate-agent">Real Estate Agent</option>
                      <option value="referral">Friend / Referral</option>
                    </select>
                    {errors.source && <p className="text-red-500 text-sm mt-1">{errors.source}</p>}
                  </div>

                  {formData.source === "real-estate-agent" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Agent Name *</label>
                        <input
                          type="text"
                          name="agentName"
                          value={formData.agentName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                        />
                        {errors.agentName && <p className="text-red-500 text-sm mt-1">{errors.agentName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Agent Mobile</label>
                        <input
                          type="tel"
                          name="agentMobile"
                          value={formData.agentMobile}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                        />
                        {errors.agentMobile && <p className="text-red-500 text-sm mt-1">{errors.agentMobile}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Agent RERA Number *</label>
                        <input
                          type="text"
                          name="agentRERA"
                          value={formData.agentRERA}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                          placeholder="e.g. RERA-AGENT-12345"
                        />
                        {errors.agentRERA && <p className="text-red-500 text-sm mt-1">{errors.agentRERA}</p>}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
                      <input
                        type="text"
                        name="accountHolder"
                        value={formData.accountHolder}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                        placeholder="Enter account holder name"
                      />
                      {errors.accountHolder && <p className="text-red-500 text-sm mt-1">{errors.accountHolder}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cheque No *</label>
                      <input
                        type="text"
                        name="chequeNo"
                        value={formData.chequeNo}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                        placeholder="Enter cheque number"
                      />
                      {errors.chequeNo && <p className="text-red-500 text-sm mt-1">{errors.chequeNo}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bank Branch *</label>
                      <input
                        type="text"
                        name="bankBranch"
                        value={formData.bankBranch}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                        placeholder="Enter bank branch"
                      />
                      {errors.bankBranch && <p className="text-red-500 text-sm mt-1">{errors.bankBranch}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                      <input
                        type="date"
                        name="instrumentDate"
                        value={formData.instrumentDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                      />
                      {errors.instrumentDate && <p className="text-red-500 text-sm mt-1">{errors.instrumentDate}</p>}
                    </div>
                </div>
              </div>            
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Documents</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar File *</label>
                    <input
                      type="file"
                      name="aadhaarFile"
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                    />
                    {errors.aadhaarFile && <p className="text-red-500 text-sm mt-1">{errors.aadhaarFile}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pan File *</label>
                    <input
                      type="file"
                      name="panFile"
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                    />
                    {errors.panFile && <p className="text-red-500 text-sm mt-1">{errors.panFile}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photo *</label>
                    <input
                      type="file"
                      name="userPhoto"
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                    />
                    {errors.userPhoto && <p className="text-red-500 text-sm mt-1">{errors.userPhoto}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Signature *</label>
                    <input
                      type="file"
                      name="signature"
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                    />
                    {errors.signature && <p className="text-red-500 text-sm mt-1">{errors.signature}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cheque Photo *</label>
                    <input
                      type="file"
                      name="chequePhoto"
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                    />
                    {errors.chequePhoto && <p className="text-red-500 text-sm mt-1">{errors.chequePhoto}</p>}
                  </div>
                  {formData.userType === 'broker' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">RERA certificate *</label>
                      <input
                        type="file"
                        name="reraCertificate"
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                      />
                      {errors.reraCertificate && <p className="text-red-500 text-sm mt-1">{errors.reraCertificate}</p>}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Declaration</h2>
                <p className="text-gray-700 text-sm mb-4">
                  I hereby declare that all the information provided above is true, complete, and accurate to the best of my knowledge. I understand that providing false or misleading information may result in consequences as per the relevant rules and regulations.
                </p>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="declarationAccepted"
                      checked={formData.declarationAccepted}
                      onChange={handleChange}
                      className="w-5 h-5 border border-gray-300 rounded focus:border-suncity-brown"
                    />
                    <span className="text-gray-700 text-sm">I agree</span>
                  </label>
                  {errors.declarationAccepted && <p className="text-red-500 text-sm mt-1">{errors.declarationAccepted}</p>}
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      name="declarationName"
                      value={formData.declarationName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                      placeholder="Enter name"
                    />
                    {errors.declarationName && <p className="text-red-500 text-sm mt-1">{errors.declarationName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      name="declarationLocation"
                      value={formData.declarationLocation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                      placeholder="Enter location"
                    />
                    {errors.declarationLocation && <p className="text-red-500 text-sm mt-1">{errors.declarationLocation}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      name="declarationDate"
                      value={formData.declarationDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-suncity-brown"
                    />
                    {errors.declarationDate && <p className="text-red-500 text-sm mt-1">{errors.declarationDate}</p>}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 0}
                className={`px-8 py-3 rounded-lg font-medium transition ${
                  step === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Previous
              </button>

              <button
                disabled={loading}
                type="submit"
                className="px-10 py-3 bg-suncity-brown text-white font-medium rounded-lg hover:bg-black transition shadow-md"
              >
                {step === 4 ? "Submit EOI" : "Next →"}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-8 text-xs text-gray-500">
          Developed by Ecorp
        </div>
      </div>
    </div>
    </>
  );
};

export default EOIForm;