import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { id: 1, title: "Referral Source" },
  { id: 2, title: "Personal Details" },
  { id: 3, title: "Project Interest" },
  { id: 4, title: "Photo & Document" },
  { id: 5, title: "Declaration" },
];

const VisitorRegistrationForm = ({ goBack }: { goBack: () => void }) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState({
    referral: "direct",
    brokerName: "",
    brokerPhone: "",
    brokerId: "",
    name: "",
    email: "",
    phone: "",
    aadharLast4: "",
    address: "",
    occupation: "",
    budget: "",
    project: "",
    projectConfig: "",
    location: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [usingCamera, setUsingCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraStream = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
    cameraStream.current = stream;
    setUsingCamera(true);
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  const stopCamera = () => {
    cameraStream.current?.getTracks().forEach((t) => t.stop());
    setUsingCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "visitor-photo.jpg", { type: "image/jpeg" });
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(blob));
      stopCamera();
    });
  };

  const handleGalleryPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      if (photo) form.append("photo", photo);

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        goBack();
      }, 3000);
    } catch (err) {
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 5) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="relative flex flex-col items-center">
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white ${
                      step >= s.id ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                    animate={{ scale: step === s.id ? 1.1 : 1 }}
                  >
                    {step > s.id ? "✓" : s.id}
                  </motion.div>
                  <p className="mt-2 text-sm font-medium text-gray-700">{s.title}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-4 bg-gray-300">
                    <motion.div
                      className="h-full bg-indigo-600"
                      initial={{ width: "0%" }}
                      animate={{ width: step > s.id ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-[5px] p-8 md:p-12">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="space-y-8"
            >
              {step === 1 && (
                <>
                  <h3 className="text-2xl font-bold text-gray-800">How did you hear about us?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {["direct", "broker"].map((opt) => (
                      <label
                        key={opt}
                        className={`border-2 rounded-xl p-6 text-center cursor-pointer transition-all ${
                          formData.referral === opt
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="referral"
                          value={opt}
                          checked={formData.referral === opt}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className="text-lg font-medium capitalize">
                          {opt === "direct" ? "Direct" : opt === "broker" ? "Broker" : ""}
                        </span>
                      </label>
                    ))}
                  </div>

                  {formData.referral === "broker" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                      <input
                        type="text"
                        name="brokerName"
                        placeholder="Broker Name"
                        value={formData.brokerName}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                        required
                      />
                      <input
                        type="tel"
                        name="brokerPhone"
                        placeholder="Broker Phone"
                        value={formData.brokerPhone}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                        required
                      />
                      <input
                        type="text"
                        name="brokerId"
                        placeholder="Broker ID (optional)"
                        value={formData.brokerId}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                      />
                    </motion.div>
                  )}
                </>
              )}

              {step === 2 && (
                <>
                  <h3 className="text-2xl font-bold text-gray-800">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" name="name" placeholder="Full Name *" value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none" required />
                    <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none" required />
                    <input type="tel" name="phone" placeholder="Phone *" value={formData.phone} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none" required />
                    <input type="text" name="aadharLast4" placeholder="Aadhar Last 4 Digits *" value={formData.aadharLast4} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none" required />
                    <input type="text" name="occupation" placeholder="Occupation" value={formData.occupation} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none" />
                    <input type="text" name="budget" placeholder="Budget Range" value={formData.budget} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none" />
                    <textarea name="address" placeholder="Address *" rows={3} value={formData.address} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none" required />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h3 className="text-2xl font-bold text-gray-800">Project Preferences</h3>
                  <div className="space-y-8">
                    <div>
                      <p className="font-medium mb-4">Configuration Interested In</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {["3 BHK", "4 BHK", "Both"].map((config) => (
                          <label
                            key={config}
                            className={`border-2 rounded-xl p-6 text-center cursor-pointer transition-all ${
                              formData.projectConfig === config
                                ? "border-indigo-600 bg-indigo-50"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            <input
                              type="radio"
                              name="projectConfig"
                              value={config}
                              checked={formData.projectConfig === config}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <span className="text-lg font-medium">{config}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h3 className="text-2xl font-bold text-gray-800">Photo & ID Document</h3>
                  <div className="space-y-10">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                      <p className="mb-4 text-lg font-semibold text-gray-800">
                        Visitor Photo <span className="text-red-500">*</span>
                      </p>

                      {!photoPreview ? (
                        <div className="flex flex-col items-center gap-6 md:flex-row">
                          <button
                            type="button"
                            onClick={startCamera}
                            className="
                              inline-flex items-center justify-center
                              rounded-lg border-2 border-indigo-600
                              bg-indigo-600 px-8 py-3
                              font-semibold text-white
                              shadow-md
                              transition-all duration-200
                              hover:bg-indigo-700 hover:border-indigo-700
                              active:scale-95
                            "
                          >
                            📷 Take Photo
                          </button>

                          <span className="text-gray-400 font-medium">OR</span>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="
                              inline-flex items-center justify-center
                              rounded-lg border-2 border-gray-300
                              bg-white px-8 py-3
                              font-semibold text-gray-700
                              shadow-sm
                              transition-all duration-200
                              hover:border-gray-400 hover:bg-gray-50
                              active:scale-95
                            "
                          >
                            🖼️ Upload from Gallery
                          </button>

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleGalleryPhoto}
                            className="hidden"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative">
                            <img
                              src={photoPreview}
                              alt="Visitor Preview"
                              className="h-48 w-48 rounded-xl object-cover border border-gray-300 shadow-md"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setPhoto(null);
                              setPhotoPreview(null);
                            }}
                            className="
                              text-sm font-semibold text-red-600
                              hover:underline
                            "
                          >
                            Retake / Change Photo
                          </button>
                        </div>
                      )}

                      {usingCamera && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                          <div className="w-full max-w-lg rounded-xl bg-black p-4 shadow-2xl">
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              className="w-full rounded-lg border border-gray-700"
                            />

                            <div className="mt-6 flex justify-center gap-6">
                              <button
                                type="button"
                                onClick={capturePhoto}
                                className="
                                  inline-flex items-center justify-center
                                  rounded-lg border-2 border-indigo-600
                                  bg-indigo-600 px-10 py-3
                                  text-lg font-semibold text-white
                                  shadow-md
                                  hover:bg-indigo-700
                                  active:scale-95
                                  transition
                                "
                              >
                                Capture
                              </button>

                              <button
                                type="button"
                                onClick={stopCamera}
                                className="
                                  inline-flex items-center justify-center
                                  rounded-lg border-2 border-gray-400
                                  bg-white px-10 py-3
                                  text-lg font-semibold text-gray-700
                                  shadow-sm
                                  hover:bg-gray-100
                                  active:scale-95
                                  transition
                                "
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {step === 5 && (
                <div className="max-w-2xl mx-auto text-center space-y-8">
                  <h3 className="text-2xl font-bold text-gray-800">Final Declaration</h3>
                  <p className="text-gray-600 leading-relaxed">
                    I hereby declare that all the information provided above is true and correct to the best of my knowledge.
                  </p>
                  <label className="flex items-center justify-center gap-4 text-lg">
                    <input
                      type="checkbox"
                      checked={declarationAccepted}
                      onChange={(e) => setDeclarationAccepted(e.target.checked)}
                      className="w-6 h-6"
                    />
                    <span>I accept the declaration</span>
                  </label>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="
                  inline-flex items-center justify-center
                  rounded-lg border-2 border-gray-300
                  bg-white px-8 py-3
                  font-semibold text-gray-700
                  shadow-sm
                  transition-all duration-200
                  hover:border-gray-400 hover:bg-gray-50
                  active:scale-95
              "
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex justify-end gap-4">
              {step < 5 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="
                    inline-flex items-center justify-center
                    rounded-lg border-2 border-indigo-600
                    bg-indigo-600 px-10 py-3
                    font-semibold text-white
                    shadow-md
                    transition-all duration-200
                    hover:bg-indigo-700 hover:border-indigo-700
                    active:scale-95
                  "
                >
                  Next →
                </button>
              )}

              {step === 5 && (
                <button
                  type="submit"
                  disabled={
                    !declarationAccepted || !photo || loading
                  }
                  className="inline-flex items-center justify-center rounded-lg border-2 border-indigo-600 bg-indigo-600 px-10 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-indigo-700 hover:border-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-600"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Submitting…
                    </span>
                  ) : (
                    "Submit Registration"
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-md"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-6xl mb-6"
              >
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800">Registration Successful!</h2>
              <p className="mt-4 text-gray-600">Thank you for registering. We'll get in touch soon.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VisitorRegistrationForm;