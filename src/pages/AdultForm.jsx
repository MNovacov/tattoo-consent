import { useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import SignatureCanvas from 'react-signature-canvas';
import emailjs from '@emailjs/browser';
import jsPDF from "jspdf";
import { uploadFile } from '@uploadcare/upload-client';

export default function AdultForm() {
  const { state } = useLocation(); 
  const sigCanvas = useRef(); 
  const sigCanvasArtist = useRef(); 
  

  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
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
    consent: {
      infoReceived: false,
      correctText: false,
      anestheticResponsibility: false,
      imageConsent: false,
      tattooConsent: false,
    },
  });

  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckbox = (section, field) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field],
      },
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSending(true);

  try {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Consentimiento Informado - Kairos Ink", 10, 15);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    let y = 30;
    pdf.text(`Nombre: ${form.name}`, 10, y);
    pdf.text(`Edad: ${form.age}`, 10, y += 10);
    pdf.text(`Email: ${form.email}`, 10, y += 10);
    pdf.text(`Teléfono: ${form.phone}`, 10, y += 10);
    pdf.text(`Emergencia: ${form.emergency}`, 10, y += 10);
    pdf.text(`Tatuador: ${state?.artist}`, 10, y += 10);

    y += 10;
    pdf.setFont("helvetica", "bold");
    pdf.text("Texto de consentimiento:", 10, y);
    pdf.setFont("helvetica", "normal");
    y += 10;

    const consentimiento = [
      "Comprendo que un tatuaje es una herida en la piel que puede evolucionar como cualquier otra herida,",
      "pudiendo presentar infecciones, irritaciones, inflamaciones u otras complicaciones. Estas pueden deberse",
      "a diversos factores como una curación inadecuada, sensibilidad específica de la piel, alergias, el estado",
      "del sistema inmunológico de cada persona, entre otros.",
      "",
      "Entiendo y acepto que durante la realización del tatuaje puedo desarrollar alergia a alguno de los materiales",
      "utilizados. Cualquier problema que surja y que no esté comprobado como consecuencia de una mala praxis",
      "será de mi entera responsabilidad. Me comprometo a seguir las indicaciones entregadas para el cuidado del tatuaje.",
    ];

    consentimiento.forEach(line => {
      pdf.text(line, 10, y);
      y += 7;
    });

    y += 10;
    pdf.text("Firma del cliente:", 10, y);
    const signatureClient = sigCanvas.current.toDataURL("image/png");
    pdf.addImage(signatureClient, "PNG", 10, y + 5, 120, 40);
    y += 50;

    pdf.text("Firma del tatuador:", 10, y);
    const signatureArtist = sigCanvasArtist.current.toDataURL("image/png");
    pdf.addImage(signatureArtist, "PNG", 10, y + 5, 120, 40);
    y += 50;

    const today = new Date().toLocaleDateString("es-CL");
    pdf.text(`Fecha: ${today}`, 10, y);

    const pdfBlob = pdf.output("blob");

    const result = await uploadFile(pdfBlob, {
      publicKey: '15bb8151e7a3d1fb0753',
      store: 'auto',
      metadata: {
        name: form.name,
        artist: state?.artist || "No especificado",
      }
    });

    const pdfURL = result.cdnUrl;

    const templateParams = {
      name: form.name,
      age: form.age,
      email: form.email,
      phone: form.phone,
      emergency: form.emergency,
      artist: state?.artist || "No especificado",
      pdf_link: pdfURL,
    };

    await emailjs.send(
      "service_1dg9h7v",
      "template_9aabnl6",
      templateParams,
      "F1xPVLlu6VYh4U0Jg"
    );

    // Notionn
      await fetch("https://tattoo-consent-api.vercel.app/api/add", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    Cliente: form.name,
    "Email Cliente": form.email,
    "Teléfono Cliente": form.phone,
    "Teléfono Emergencia": form.emergency,
    "Edad Cliente": parseInt(form.age),
    "Menor de Edad": false,
    "Nombre Tutor": null,
    "Email Tutor": null,
    Tatuador: state?.artist || "No especificado",
    "Zona a Tatuar": null,
    Sesiones: null,
    Fecha: new Date().toISOString(),
    Valor: null,
    Abono: null,
    Alergias: form.allergy === "SI" ? form.allergyDetail : "Ninguna",
    "Firma Cliente": pdfURL,
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
      <h2 className="text-2xl font-bold text-center mb-6">Consentimiento Adulto</h2>
      <div className="max-w-3xl mx-auto space-y-4">
        <p className="text-sm text-purple-300">Tatuador: <span className="font-bold">{state?.artist}</span></p>

        <input name="name" placeholder="Nombre completo" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />
        <input name="age" type="number" placeholder="Edad" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />
        <input name="email" placeholder="Correo electrónico" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />
        <input name="phone" placeholder="Teléfono" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />
        <input name="emergency" placeholder="Teléfono de emergencia" onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-gray-700 placeholder-gray-400" />

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

        <div className="space-y-2">
          <p className="font-bold mt-6">Consentimientos:</p>
          {[
            { id: "correctText", label: "Apruebo que tanto la tipografía, la ortografía, la numeración y el significado son correctos." },
            { id: "tattooConsent", label: "Doy el consentimiento a los artistas de TATTOO STUDIO KAIROS INK para que me realicen un TATUAJE." },
            { id: "anestheticResponsibility", label: "En el caso que desee ocupar anestesia en el proceso de mi tatuaje, queda bajo mi responsabilidad todos los efectos segundarios que tiene." },
            { id: "imageConsent", label: "Doy el consentimiento a TATTOO STUDIO KAIROS INK para que utilicen mi imagen y publiquen los trabajos en redes sociales y otros medios." },
          ].map(({ id, label }) => (
            <div key={id} className="flex items-center gap-2">
              <input type="checkbox" onChange={() => handleCheckbox("consent", id)} checked={form.consent[id]} />
              <label>{label}</label>
            </div>
          ))}
        </div>

        <details className="bg-white/5 border border-gray-700 rounded p-3 mt-4 text-sm leading-relaxed">
          <summary className="cursor-pointer font-bold text-purple-300">Leer todos los términos</summary>
          <div className="mt-2 space-y-4">
            <p>
              Comprendo que un tatuaje es una herida en la piel que puede evolucionar como cualquier otra herida, pudiendo presentar infecciones, irritaciones, inflamaciones u otras complicaciones. Estas pueden deberse a diversos factores como una curación inadecuada, sensibilidad específica de la piel, alergias, el estado del sistema inmunológico de cada persona, entre otros.
            </p>
            <p>
              Entiendo y acepto que durante la realización del tatuaje puedo desarrollar alergia a alguno de los materiales utilizados. Cualquier problema que surja y que no esté comprobado como consecuencia de una mala praxis (como fallas en la esterilización, desinfección del material o condiciones del local) será de mi entera responsabilidad. Me comprometo a seguir las indicaciones entregadas para el cuidado del tatuaje.
            </p>
            <p className="font-semibold text-white">Medidas higiénicas adoptadas para la salud del cliente:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Se comprobará la ausencia de lesiones o contraindicaciones visibles en la zona a tatuar.</li>
              <li>Se emplea material estéril y/o de un solo uso.</li>
              <li>Las agujas son estériles, desechables y se usan una sola vez.</li>
              <li>Los pigmentos utilizados cuentan con homologación y cumplen la normativa vigente.</li>
              <li>El área de trabajo y la zona anatómica a tatuar serán debidamente desinfectadas.</li>
            </ul>
          </div>
        </details>

        {/* Firma dibujable cliente */}
        <div className="mt-6 space-y-2">
          <p className="text-sm text-gray-300 font-semibold">Firma del Cliente:</p>
          <div className="border border-gray-500 rounded bg-white">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{ width: 600, height: 200, className: "rounded" }}
            />
          </div>
          <button type="button" onClick={() => sigCanvas.current.clear()} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm">
            Limpiar firma
          </button>
        </div>
        {/* Firma del tatuador */}
<div className="mt-6 space-y-2">
  <p className="text-sm text-gray-300 font-semibold">Firma del Tatuador:</p>
  <div className="border border-gray-500 rounded bg-white">
    <SignatureCanvas
      ref={sigCanvasArtist}
      penColor="black"
      canvasProps={{ width: 600, height: 200, className: "rounded" }}
    />
  </div>
  <button
    type="button"
    onClick={() => sigCanvasArtist.current.clear()}
    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
  >
    Limpiar firma del tatuador
  </button>
</div>
   

        <button
          onClick={handleSubmit}
          disabled={isSending}
          className={`w-full mt-6 py-3 rounded font-bold text-white ${
            isSending ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-700 hover:bg-purple-600'
          }`}
        >
          {isSending ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}

