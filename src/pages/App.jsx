import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'animate.css';

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
  const [showGuestInput, setShowGuestInput] = useState(false);
  const [newArtist, setNewArtist] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);

  
  const [tattooArtists, setTattooArtists] = useState(() => {
    const saved = localStorage.getItem("tattooArtists");
    return saved ? JSON.parse(saved) : [
      "Francisco",
      "Camils",
      "Selek",
      "Eme",
      "Dess",
      "Renan",
      "Invitado"
    ];
  });

  
  useEffect(() => {
    localStorage.setItem("tattooArtists", JSON.stringify(tattooArtists));
  }, [tattooArtists]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "artist") {
      setShowGuestInput(value === "Invitado");
      if (value !== "Invitado") {
        setTattooData({ ...tattooData, artist: value });
      }
    } else {
      setTattooData({ ...tattooData, [name]: value });
    }
  };

  const addArtist = () => {
    if (newArtist.trim() && !tattooArtists.includes(newArtist.trim())) {
      setTattooArtists([...tattooArtists, newArtist.trim()]);
      setNewArtist("");
      setShowAddInput(false);
      setTattooData({...tattooData, artist: newArtist.trim()});
    }
  };

  const removeArtist = (artistToRemove) => {
    if (artistToRemove !== "Invitado") {
      setTattooArtists(tattooArtists.filter(artist => artist !== artistToRemove));
      if (tattooData.artist === artistToRemove) {
        setTattooData({...tattooData, artist: ""});
      }
    }
  };

  const handleNavigation = (path) => {
  navigate(path, { state: tattooData });
};

  const arrowSvg = `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0a0a0'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e")`;

  
  const sortedArtists = [...tattooArtists].sort((a, b) => {
    if (a === "Invitado") return 1;
    if (b === "Invitado") return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-gray-900 text-white flex flex-col items-center justify-center px-4 py-8">
      <h1 class="animate__animated animate__fadeIn"><img src="/logo.png" alt="Kairos Ink Logo" className="w-40 md:w-48 lg:w-56 mb-6" /></h1>
      <h1 className="text-3xl font-bold mb-4 text-white">Formulario de Consentimiento</h1>

      <div className="w-full max-w-md space-y-4">
        <div className="flex items-start gap-2">
          <div className="relative flex-grow">
            <select 
              name="artist" 
              onChange={handleChange} 
              value={tattooData.artist}
              required
              style={{
                width: '100%',
                padding: '0.5rem 2.5rem 0.5rem 0.75rem',
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '0.375rem',
                appearance: 'none',
                backgroundImage: arrowSvg,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.5em',
                fontSize: '1rem',
                lineHeight: '1.5',
              }}
              className="focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:font-semibold"
            >
              <option value="" disabled style={{ color: '#a0a0a0', backgroundColor: '#1a1a1a' }}>
                Selecciona un tatuador
              </option>
              {sortedArtists.map((artist) => (
                <option 
                  key={artist} 
                  value={artist} 
                  style={{ color: '#ffffff', backgroundColor: '#1a1a1a' }}
                >
                  {artist}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => setShowAddInput(!showAddInput)}
            className="flex-shrink-0 w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-bold text-xl flex items-center justify-center mt-1 transition-colors duration-200"
          >
            +
          </button>
        </div>

        {showAddInput && (
          <div className="flex items-center gap-2 bg-gray-800/50 p-3 rounded-lg">
            <input
              type="text"
              value={newArtist}
              onChange={(e) => setNewArtist(e.target.value)}
              placeholder="Nombre del nuevo tatuador"
              className="flex-grow p-2 rounded bg-white/10 border border-gray-600 placeholder-gray-300"
              onKeyPress={(e) => e.key === 'Enter' && addArtist()}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddInput(false)}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white"
              >
                Cancelar
              </button>
              <button
                onClick={addArtist}
                disabled={!newArtist.trim()}
                className="px-3 py-2 bg-green-600 hover:bg-purple-700 rounded text-white disabled:opacity-50"
              >
                Añadir
              </button>
            </div>
          </div>
        )}

        {tattooData.artist && tattooData.artist !== "Invitado" && (
          <button
            onClick={() => removeArtist(tattooData.artist)}
            className="w-full py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded text-sm flex items-center justify-center gap-1 transition-colors"
          >
            <span>Eliminar</span>
            <span className="font-bold">"{tattooData.artist}"</span>
            <span>de la lista</span>
          </button>
        )}

        {showGuestInput && (
          <input
            name="guestArtistName"
            placeholder="Nombre del tatuador invitado"
            onChange={handleChange}
            className="w-full p-2 rounded bg-white/10 border border-gray-600 placeholder-gray-300"
          />
        )}

        <input name="zone" placeholder="Zona a tatuar" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-600 placeholder-gray-300" />
        <input name="sessions" placeholder="Sesiones" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-600 placeholder-gray-300" />
       <input
        type="date"
        name="date"
        value={tattooData.date || new Date().toISOString().split("T")[0]}
        onChange={handleChange}
        className="w-full p-2 rounded bg-white/10 border border-gray-600 text-white placeholder-gray-300"
        style={{
         textAlign: 'left',
         minWidth: 0,
         maxWidth: '100%',
         appearance: 'none',
         WebkitAppearance: 'none',
         MozAppearance: 'textfield',
  }}
/>

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
