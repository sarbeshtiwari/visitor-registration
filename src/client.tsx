import { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import HomeScreen from "./components/HomeScreen";
import VisitorRegistrationForm from "./components/VisitorRegistrationForm";
import Footer from "./components/Footer";

const Client = () => {
  const [screen, setScreen] = useState("home");
  const [ip, setIp] = useState("");

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp("Unable to fetch"));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <TopBar />
      <div className="flex-1">
        {screen === "home" && <HomeScreen goToForm={() => setScreen("form")} />}
        {screen === "form" && (
          <VisitorRegistrationForm
            goBack={() => setScreen("home")}
          />
        )}
      </div>
      <Footer ip={ip} />
    </div>
  );
};

export default Client;
