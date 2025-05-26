import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const [tattooData, setTattooData] = useState({
    artist: "",
    zone: "",
    sessions: "",
    date: "",
    value: "",
    deposit: ""
  });

  const handleChange = (e) => {
    setTattooData({ ...tattooData, [e.target.name]: e.target.value });
  };

  const handleNavigation = (route) => {
    if (!tattooData.artist) return alert("Por favor, escribe el nombre del tatuador.");
    navigate(route, { state: tattooData });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-gray-900 text-white flex flex-col items-center justify-center px-4 py-8">
      <img src="/logo.png" alt="Kairos Ink Logo" className="w-40 md:w-48 lg:w-56 mb-6" />
      <h1 className="text-3xl font-bold mb-4 text-white">Tattoo Studio Kairos Ink</h1>

      <div className="w-full max-w-md space-y-4">
        <input name="artist" placeholder="Nombre del tatuador" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-600 placeholder-gray-300" />
        <input name="zone" placeholder="Zona a tatuar" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-600 placeholder-gray-300" />
        <input name="sessions" placeholder="Sesiones" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-600 placeholder-gray-300" />
        <input type="date" name="date" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-600 text-white placeholder-gray-300" />
        <input name="value" placeholder="Valor ($)" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-600 placeholder-gray-300" />
        <input name="deposit" placeholder="Abono ($)" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-600 placeholder-gray-300" />

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button onClick={() => handleNavigation("/form/adult")} className="flex-1 bg-purple-700 hover:bg-purple-600 rounded p-3 font-bold">
            Nuevo Cliente +18
          </button>
          <button onClick={() => handleNavigation("/form/minor")} className="flex-1 bg-gray-700 hover:bg-gray-600 rounded p-3 font-bold">
            Cliente menor de edad
          </button>
        </div>
      </div>
    </div>
  );
}
