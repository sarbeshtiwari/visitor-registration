import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VisitorRegistrationForm = ({ goBack }: {goBack: any}) => {
  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    aadharLast4: "",
    project: "",
    location: "",
    address: "",
    occupation: "",
    budget: "",
    referral: "no",
    brokerName: "",
    brokerPhone: "",
    brokerId: "",
    otherName: "",
    otherPhone: "",
    otherRelation: "",
    notes: "",
  });

  type FormData = typeof formData;

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoMode, setPhotoMode] = useState<"gallery" | "camera">("gallery");
  const [usingCamera, setUsingCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      setCameraStream(stream);
      setUsingCamera(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied or unavailable.");
      console.error(err);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });

      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(blob));

      stopCamera();
    });
  };

  const stopCamera = () => {
    cameraStream?.getTracks().forEach((track) => track.stop());
    setUsingCamera(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    if (!photo) {
      alert("Please upload/capture a photo.");
      return;
    }

    try {
      const apiUrl = "https://your-api-endpoint.com/register";

      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        form.append(key, (formData as any)[key]);
      });
      form.append("photo", photo);
      setShowPopup(true);
      const res = await fetch(apiUrl, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        throw new Error("API Error");
      }
      setTimeout(() => {
        setShowPopup(false);
        goBack();
      }, 2500);

    } catch (error) {
      console.error("Submit error:", error);
      alert("Error submitting data. Please try again.");
      setShowPopup(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center">
              <h2 className="text-3xl font-bold">Visitor Registration</h2>
              <p className="mt-2 opacity-90">Please fill in your details below</p>
            </div>
            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Full Name", name: "name", type: "text", required: true },
                  { label: "Email Address", name: "email", type: "email", required: true },
                  { label: "Phone Number", name: "phone", type: "text", maxLength: 10, required: true },
                  { label: "Aadhaar Last 4 Digits", name: "aadharLast4", type: "text", maxLength: 4, required: false },
                  { label: "Interested Project", name: "project", type: "text", required: true },
                  { label: "City / Location", name: "location", type: "text", required: true },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      maxLength={field.maxLength}
                      required={field.required}
                      value={formData[field.name as keyof FormData]}

                      onChange={handleChange}
                      className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 outline-none shadow-sm"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 outline-none shadow-sm"
                    placeholder="Full residential address"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Occupation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      required
                      value={formData.occupation}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 outline-none shadow-sm"
                      placeholder="e.g. Software Engineer, Business"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Budget (₹ in Lakhs) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="budget"
                      required
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 outline-none shadow-sm"
                      placeholder="e.g. 75"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  How did you hear about us? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["no", "broker", "other"].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center justify-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.referral === option
                          ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="referral"
                        value={option}
                        checked={formData.referral === option}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="font-medium capitalize">
                        {option === "no" ? "Direct / Walk-in" : option === "broker" ? "Broker" : "Friend / Other"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <AnimatePresence>
                {formData.referral === "broker" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden space-y-6 bg-blue-50 p-6 rounded-2xl border border-blue-200"
                  >
                    <h3 className="font-bold text-lg text-blue-800">Broker Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        type="text"
                        name="brokerName"
                        placeholder="Broker Name *"
                        required
                        value={formData.brokerName}
                        onChange={handleChange}
                        className="px-5 py-4 border border-blue-300 bg-white rounded-xl focus:ring-4 focus:ring-blue-300"
                      />
                      <input
                        type="text"
                        name="brokerPhone"
                        placeholder="Broker Phone *"
                        maxLength={10}
                        required
                        value={formData.brokerPhone}
                        onChange={handleChange}
                        className="px-5 py-4 border border-blue-300 bg-white rounded-xl focus:ring-4 focus:ring-blue-300"
                      />
                    </div>
                    <input
                      type="text"
                      name="brokerId"
                      placeholder="Broker ID (Optional)"
                      value={formData.brokerId}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border border-blue-300 bg-white rounded-xl"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {formData.referral === "other" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden space-y-6 bg-emerald-50 p-6 rounded-2xl border border-emerald-200"
                  >
                    <h3 className="font-bold text-lg text-emerald-800">Referred By</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        type="text"
                        name="otherName"
                        placeholder="Name *"
                        required
                        value={formData.otherName}
                        onChange={handleChange}
                        className="px-5 py-4 border border-emerald-300 bg-white rounded-xl"
                      />
                      <input
                        type="text"
                        name="otherPhone"
                        placeholder="Phone *"
                        maxLength={10}
                        required
                        value={formData.otherPhone}
                        onChange={handleChange}
                        className="px-5 py-4 border border-emerald-300 bg-white rounded-xl"
                      />
                    </div>
                    <input
                      type="text"
                      name="otherRelation"
                      placeholder="Relationship / Source (e.g. Friend, Colleague, Facebook) *"
                      required
                      value={formData.otherRelation}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border border-emerald-300 bg-white rounded-xl"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 outline-none shadow-sm"
                  placeholder="Any specific requirements, preferences, or questions..."
                />
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Visitor Photo <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoMode("gallery");
                      stopCamera();
                    }}
                    className={`px-5 py-2 rounded-xl border text-sm font-medium ${
                      photoMode === "gallery"
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "border-gray-400 text-gray-700 bg-white"
                    }`}
                  >
                    Upload from Gallery
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoMode("camera");
                      startCamera();
                    }}
                    className={`px-5 py-2 rounded-xl border text-sm font-medium ${
                      photoMode === "camera"
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : "border-gray-400 text-gray-700 bg-white"
                    }`}
                  >
                    Use Camera
                  </button>
                </div>
                {photoMode === "gallery" && !usingCamera && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl bg-white 
                              shadow-sm focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    required
                  />
                )}
                {usingCamera && (
                  <div className="flex flex-col items-center mt-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-64 h-64 object-cover rounded-2xl shadow-lg border-4 border-white bg-black"
                    />

                    <div className="flex gap-4 mt-4">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="px-6 py-2 bg-green-600 text-white rounded-xl shadow-md"
                      >
                        Capture
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          stopCamera();
                          setPhotoMode("gallery");
                        }}
                        className="px-6 py-2 bg-red-600 text-white rounded-xl shadow-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {photoPreview && !usingCamera && (
                  <div className="mt-6 flex justify-center">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-2xl shadow-xl border-4 border-white"
                    />
                  </div>
                )}
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-xl py-5 rounded-xl hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Submit Registration
              </button>
            </form>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center"
            >
              <div className="text-8xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Thank You!</h2>
              <p className="text-lg text-gray-600">Your visit has been successfully registered.</p>
              <p className="text-sm text-gray-500 mt-4">Redirecting you back...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VisitorRegistrationForm;