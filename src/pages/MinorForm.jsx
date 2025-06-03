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
    minorName: "",
    minorBirth: "",
    minorEmail: "",
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
      pdf.text(`Edad: ${form.age}`, 10, y += 10);
      pdf.text(`Nacimiento: ${form.minorBirth}`, 10, (y += 10));
      pdf.text(`Correo Menor: ${form.minorEmail || "(no entregado)"}`, 10, (y += 10));
      pdf.text(`Tatuador: ${state?.artist}`, 10, (y += 10));

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
        artist: state?.artist || "No especificado",
        pdf_link: pdfURL,
      };

      await emailjs.send("service_1dg9h7v", "template_9aabnl6", templateParams, "F1xPVLlu6VYh4U0Jg");

      await fetch("https://tattoo-consent-api.vercel.app/api/addd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Cliente: form.minorName,  
        "Email Cliente": form.minorEmail, 
        "Teléfono Cliente": null, 
        "Teléfono Emergencia": null, 
        "Edad Cliente": parseInt(form.age),
        "Menor de Edad": true,
        "Nombre Tutor": form.tutorName || "No especificado", 
        "Email Tutor": form.tutorEmail || "No especificado", 
        Tatuador: state?.artist || "No especificado",
        "Zona a Tatuar": state?.zone || "No especificado",
        Sesiones: state?.sessions || 1,
        Fecha: state?.date || new Date().toISOString(),
        Valor: state?.value ? parseInt(state.value) : 0,
        Abono: state?.deposit ? parseInt(state.deposit) : 0,
        Alergias: "Ninguna", 
        "Firma Cliente": pdfURL
      })
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

        <p className="mt-6 font-semibold text-white">Información del Menor</p>
        <input name="minorName" placeholder="Nombre y Apellido del Menor" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />
        <input name="age" type="number" placeholder="Edad" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />
        <input name="minorEmail" type="email" placeholder="Correo del Menor (opcional)" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />

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
