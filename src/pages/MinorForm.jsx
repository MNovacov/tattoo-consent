import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function MinorForm() {
  const { state } = useLocation(); // info del tatuador
  const [form, setForm] = useState({
    tutorName: "",
    tutorEmail: "",
    minorName: "",
    minorBirth: "",
    minorEmail: "",
    consentConfirmed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = () => {
    alert("Aquí se validaría y enviaría el consentimiento de menor");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-6">Consentimiento Menor de Edad</h2>
      <div className="max-w-2xl mx-auto space-y-4">

        <p className="text-sm text-purple-300">Tatuador: <span className="font-bold">{state?.artist}</span></p>

        {/* Tutor */}
        <p className="mt-6 font-semibold text-white">Datos del Tutor</p>
        <input name="tutorName" placeholder="Nombre y Apellido del Tutor" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />
        <input name="tutorEmail" type="email" placeholder="Correo del Tutor" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />

        {/* Menor */}
        <p className="mt-6 font-semibold text-white">Información del Menor</p>
        <input name="minorName" placeholder="Nombre y Apellido del Menor" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />
        <input name="minorBirth" type="date" placeholder="Fecha de nacimiento" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 text-white" />
        <input name="minorEmail" type="email" placeholder="Correo del Menor (opcional)" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />

        {/* Confirmación */}
        <div className="mt-4 flex items-center gap-2">
          <input type="checkbox" name="consentConfirmed" onChange={handleChange} checked={form.consentConfirmed} />
          <label className="text-sm">Confirmo que he sido informado/a y autorizo el tatuaje del menor.</label>
        </div>

        {/* Términos */}
        <details className="bg-white/5 border border-gray-700 rounded p-3 mt-4">
          <summary className="cursor-pointer font-bold text-purple-300">Leer todos los términos</summary>
          <p className="text-sm mt-2">
            Declaro que he sido informado/a y entiendo los riesgos y procedimientos asociados con el tatuaje que mi pupilo esta a punto de recibir. 
Reconozco que el proceso del tatuaje implica la inyección de tinta  en la piel mediante 
aguja, lo cual puede causar dolor, molestias e incluso riesgos de salud si no se realiza y 
cuida correctamente.
          </p>
        </details>

        {/* Placeholder firmas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-center text-sm text-gray-400">
          <div className="border border-dashed border-gray-500 p-4 rounded">Firma del Tatuador ✍️</div>
          <div className="border border-dashed border-gray-500 p-4 rounded">Firma del Tutor ✍️</div>
        </div>

        <button onClick={handleSubmit} className="w-full bg-purple-700 hover:bg-purple-600 mt-6 py-3 rounded font-bold text-white">
          Enviar
        </button>
      </div>
    </div>
  );
}
