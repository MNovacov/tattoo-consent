const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { onRequest } = require("firebase-functions/v2/https");
const cors = require("cors")({ origin: true });
const jsPDF = require("jspdf");
const { v4: uuidv4 } = require("uuid");

admin.initializeApp();
const bucket = admin.storage().bucket();

exports.generateConsentPDF = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const data = req.body;
      const doc = new jsPDF();

      doc.setFontSize(12);
      doc.text(`Nombre: ${data.name}`, 10, 20);
      doc.text(`Edad: ${data.age}`, 10, 30);
      doc.text(`Email: ${data.email}`, 10, 40);
      doc.text(`Teléfono: ${data.phone}`, 10, 50);
      doc.text(`Emergencia: ${data.emergency}`, 10, 60);
      doc.text(`Tatuador: ${data.artist}`, 10, 70);

      if (data.signature) {
        doc.text("Firma:", 10, 90);
        doc.addImage(data.signature, "PNG", 10, 95, 120, 40);
      }

      const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
      const filename = `consentimientos/${data.name.replace(/\s+/g, "_")}_${uuidv4()}.pdf`;

      const file = bucket.file(filename);
      await file.save(pdfBuffer, {
        metadata: {
          contentType: "application/pdf",
        },
      });

      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 días
      });

      res.status(200).send({ pdfURL: url });
    } catch (error) {
      console.error("Error generando PDF:", error);
      res.status(500).send("Error interno");
    }
  });
});
