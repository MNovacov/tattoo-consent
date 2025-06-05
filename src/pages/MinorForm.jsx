import { useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import emailjs from "@emailjs/browser";
import jsPDF from "jspdf";
import { uploadFile } from "@uploadcare/upload-client";


export default function MinorForm() {
  const { state } = useLocation();
  const sigTutor = useRef();
  const sigArtist = useRef();

  const [form, setForm] = useState({
    tutorName: "",
    tutorEmail: "",
    phone: "",
    minorName: "",
    minorBirth: "",
    minorEmail: "",
    emergency: "",
    pressure: "NO",
    heart: "NO",
    epilepsy: "NO",
    blood: "NO",
    allergy: "NO",
    allergyDetail: "",
    skin: "NO",
    skinDetail: "",
    importantNote: "",
    consentConfirmed: false,
  });

  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const pdf = new jsPDF();
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Consentimiento Tatuaje - Menor de Edad", 10, 15);

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      let y = 30;
      pdf.text(`Tutor: ${form.tutorName}`, 10, y);
      pdf.text(`Correo Tutor: ${form.tutorEmail}`, 10, (y += 10));
      pdf.text(`Teléfono: ${form.phone}`, 10, y += 10);
      pdf.text(`Emergencia: ${form.emergency}`, 10, y += 10);
      pdf.text(`Edad: ${form.age}`, 10, y += 10);
      pdf.text(`Nacimiento: ${form.minorBirth}`, 10, (y += 10));
      pdf.text(`Correo Menor: ${form.minorEmail || "(no entregado)"}`, 10, (y += 10));
      pdf.text(`Tatuador: ${state?.artist}`, 10, (y += 10));
      pdf.text(`Zona: ${state?.zone}`, 10, y += 10);
      pdf.text(`Sesiones: ${state?.sessions}`, 10, y += 10);
      pdf.text(`Fecha tatuaje: ${state?.date}`, 10, y += 10);
      pdf.text(`Valor: $${state?.value}`, 10, y += 10);
      pdf.text(`Abono: $${state?.deposit}`, 10, y += 10);

      y += 10;
      pdf.setFont("helvetica", "bold");
      pdf.text("Texto de consentimiento:", 10, y);
      pdf.setFont("helvetica", "normal");
      y += 10;

      const consentimiento = [
        "Declaro que he sido informado/a y entiendo los riesgos y procedimientos asociados",
        "con el tatuaje que mi pupilo está a punto de recibir. Reconozco que el proceso",
        "del tatuaje implica la inyección de tinta en la piel mediante aguja, lo cual puede",
        "causar dolor, molestias e incluso riesgos de salud si no se realiza y cuida correctamente."
      ];

      consentimiento.forEach((line) => {
        pdf.text(line, 10, y);
        y += 7;
      });

      y += 10;
      pdf.text("Firma del Tutor:", 10, y);
      const tutorSign = sigTutor.current.toDataURL("image/png");
      pdf.addImage(tutorSign, "PNG", 10, y + 5, 120, 40);
      y += 50;

      const today = new Date().toLocaleDateString("es-CL");
      pdf.text(`Fecha: ${today}`, 10, y);

      y += 10;
      pdf.text("Firma del Tatuador:", 10, y);
      const artistSign = sigArtist.current.toDataURL("image/png");
      pdf.addImage(artistSign, "PNG", 10, y + 5, 120, 40);

      const pdfBlob = pdf.output("blob");

      const result = await uploadFile(pdfBlob, {
        publicKey: "15bb8151e7a3d1fb0753",
        store: "auto",
        metadata: {
          name: form.minorName,
          artist: state?.artist || "No especificado",
        },
      });

      const pdfURL = result.cdnUrl;

      const templateParams = {
        name: form.minorName,
        tutor: form.tutorName,
        email: form.tutorEmail,
        phone: form.phone,
        emergency: form.emergency,
        artist: state?.artist || "No especificado",
        pdf_link: pdfURL,
      };

      await emailjs.send("service_1dg9h7v", "template_9aabnl6", templateParams, "F1xPVLlu6VYh4U0Jg");

      await fetch("https://tattoo-consent-api.vercel.app/api/add", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    Cliente: form.minorName || "No especificado",
    "Email Cliente": form.minorEmail || "No especificado",
    "Teléfono Cliente": form.phone,
    "Teléfono Emergencia": form.emergency,
    "Edad Cliente": parseInt(form.age),
    "Menor de Edad": true,
    "Nombre Tutor": form.tutorName,
    "Email Tutor": form.tutorEmail,
    Tatuador: state?.artist || "No especificado",
    "Zona a Tatuar": state?.zone || null,
    Sesiones: state?.sessions || null,
    Fecha: state?.date || new Date().toISOString(),
    Valor: state?.value || null,
    Abono: state?.deposit || null,
    Alergias: form.allergy === "SI" ? form.allergyDetail : "Ninguna",
    "Firma Cliente": pdfURL,
  }),
});

    alert("Consentimiento enviado correctamente");
  } catch (error) {
    console.error("Error al enviar:", error);
    alert("Hubo un error al enviar el consentimiento");
  } finally {
    setIsSending(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-6">Consentimiento Menor de Edad</h2>
      <div className="max-w-2xl mx-auto space-y-4">
        <p className="text-sm text-purple-300">
          Tatuador: <span className="font-bold">{state?.artist}</span>
        </p>

        <p className="mt-6 font-semibold text-white">Datos del Tutor</p>
        <input name="tutorName" placeholder="Nombre y Apellido del Tutor" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />
        <input name="tutorEmail" type="email" placeholder="Correo del Tutor" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />
        <input name="phone" placeholder="Teléfono" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />
        <p className="mt-6 font-semibold text-white">Información del Menor</p>
        <input name="minorName" placeholder="Nombre y Apellido del Menor" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />
        <input name="age" type="number" placeholder="Edad" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />
        <input name="minorEmail" type="email" placeholder="Correo del Menor (opcional)" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />
        <input name="emergency" placeholder="Teléfono de emergencia (opcional)" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {["pressure", "heart", "epilepsy", "blood"].map((item) => (
            <div key={item} className="flex justify-between bg-white/5 p-2 rounded">
              <label>{{
                pressure: "Presión alta",
                heart: "Problema cardíaco",
                epilepsy: "Epilepsia",
                blood: "Enfermedad sanguínea"
              }[item]}</label>
              <select name={item} onChange={handleChange} className="bg-black border border-gray-600 rounded px-2">
                <option value="NO">NO</option>
                <option value="SI">SÍ</option>
              </select>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap">Alergias</label>
              <select name="allergy" onChange={handleChange} className="bg-black border border-gray-600 rounded px-2 py-1">
                <option value="NO">NO</option>
                <option value="SI">SÍ</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <label className="whitespace-nowrap">Enfermedades de la piel</label>
              <select name="skin" onChange={handleChange} className="bg-black border border-gray-600 rounded px-2 py-1">
                <option value="NO">NO</option>
                <option value="SI">SÍ</option>
              </select>
            </div>
          </div>

          {form.allergy === "SI" && (
            <input name="allergyDetail" placeholder="¿Cuál?" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />
          )}

          {form.skin === "SI" && (
            <input name="skinDetail" placeholder="¿Cuál?" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />
          )}

          <textarea name="importantNote" placeholder="Dato importante (opcional)" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400"></textarea>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input type="checkbox" name="consentConfirmed" onChange={handleChange} checked={form.consentConfirmed} />
          <label className="text-sm">Confirmo que he sido informado/a y autorizo el tatuaje del menor.</label>
        </div>

        <details className="bg-white/5 border border-gray-700 rounded p-3 mt-4">
          <summary className="cursor-pointer font-bold text-purple-300">Leer todos los términos</summary>
          <p className="text-sm mt-2">
            Declaro que he sido informado/a y entiendo los riesgos y procedimientos asociados con el tatuaje que mi pupilo esta a punto de recibir.
            Reconozco que el proceso del tatuaje implica la inyección de tinta en la piel mediante aguja, lo cual puede causar dolor, molestias e incluso riesgos de salud si no se realiza y cuida correctamente.
          </p>
        </details>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-center text-sm text-gray-400">
          <div className="space-y-2">
            <p className="text-white">Firma del Tutor</p>
            <div className="border border-gray-500 rounded bg-white">
              <SignatureCanvas ref={sigTutor} penColor="black" canvasProps={{ width: 300, height: 100, className: "rounded" }} />
            </div>
            <button type="button" onClick={() => sigTutor.current.clear()} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm">
              Limpiar firma
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-white">Firma del Tatuador</p>
            <div className="border border-gray-500 rounded bg-white">
              <SignatureCanvas ref={sigArtist} penColor="black" canvasProps={{ width: 300, height: 100, className: "rounded" }} />
            </div>
            <button type="button" onClick={() => sigArtist.current.clear()} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm">
              Limpiar firma
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSending}
          className={`w-full mt-6 py-3 rounded font-bold text-white ${
            isSending ? "bg-gray-500 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-600"
          }`}
        >
          {isSending ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}
