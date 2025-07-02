'use client'
import { useState } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";

export default function Home() {
  const [text, setText] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateQRCode = async () => {
    if (!text.trim()) {
      alert('Veuillez saisir du texte pour générer le QR code');
      return;
    }

    try {
      // URL vers Back Market section MacBook
      const backMarketUrl = "https://www.backmarket.fr";

      const url = await QRCode.toDataURL(backMarketUrl, {
        width: 128, // Réduit de 256 à 128 pixels
        margin: 1,  // Réduit la marge de 2 à 1
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Erreur lors de la génération du QR code:', error);
      alert('Erreur lors de la génération du QR code');
    }
  };

  const generatePDF = async () => {
    if (!text.trim() || !qrCodeUrl) {
      alert('Veuillez d\'abord générer un QR code');
      return;
    }

    setIsGenerating(true);

    try {
      const doc = new jsPDF();

      // Configuration des polices et couleurs
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);

      // Titre du document
      doc.text('Document généré avec QR Code', 20, 30);

      // Ligne de séparation
      doc.setLineWidth(0.5);
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 40, 190, 40);

      // Texte saisi par l'utilisateur
      doc.setFontSize(14);
      doc.setTextColor(60, 60, 60);
      doc.text('Texte saisi :', 20, 60);

      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);

      // Gérer le texte long avec retour à la ligne
      const splitText = doc.splitTextToSize(text, 150);
      doc.text(splitText, 20, 75);

      // Calculer la position pour le QR code en fonction de la longueur du texte
      const textHeight = splitText.length * 7;
      const qrYPosition = Math.max(100, 75 + textHeight + 20);

      // Informations sur le QR code
      doc.setFontSize(14);
      doc.setTextColor(60, 60, 60);
      doc.text('QR Code (redirige vers Back Market - MacBook) :', 20, qrYPosition);

      // Ajouter le QR code au PDF (taille réduite)
      doc.addImage(qrCodeUrl, 'PNG', 20, qrYPosition + 10, 30, 30);

      // URL de destination
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Destination : https://www.backmarket.fr/fr-fr/l/macbook/37', 20, qrYPosition + 50);

      // Footer avec date de génération
      const currentDate = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Généré le ${currentDate}`, 20, 280);

      // Sauvegarder le PDF
      const fileName = `qrcode_${text.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
      doc.save(fileName);

      setIsGenerating(false);

    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du PDF');
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="row-start-1">
        <h1 className="text-4xl font-bold text-center">Générateur de QR Code PDF</h1>
        <p className="text-gray-600 text-center mt-2">
          Générez un QR code qui redirige vers Back Market (MacBook) et créez un PDF
        </p>
      </header>

      <main className="row-start-2 flex flex-col items-center gap-6 w-full max-w-2xl">
        {/* Affichage conditionnel de l'image QR code */}
        {qrCodeUrl && (
          <div className="bg-white p-6 rounded-lg shadow-lg border">
            <h3 className="text-lg font-semibold mb-3 text-center">QR Code généré</h3>
            <img
              src={qrCodeUrl}
              alt="QR Code généré"
              className="max-w-full h-auto mx-auto"
            />
            <p className="text-sm text-gray-600 mt-3 text-center">
              Redirige vers : Back Market - Section MacBook
            </p>
          </div>
        )}

        {/* Champ de saisie */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="qr-code-input" className="font-medium text-gray-700">
            Texte à inclure dans le PDF :
          </label>
          <textarea
            id="qr-code-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Entrez votre texte (description, notes, etc.)..."
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-vertical"
            rows={4}
          />
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {/* Bouton de génération QR */}
          <button
            type="button"
            onClick={generateQRCode}
            disabled={!text.trim()}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Générer le QR Code
          </button>

          {/* Bouton de génération PDF */}
          <button
            type="button"
            onClick={generatePDF}
            disabled={!qrCodeUrl || isGenerating}
            className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Génération...
              </>
            ) : (
              'Générer le PDF'
            )}
          </button>
        </div>

        {/* Bouton de téléchargement direct du QR code */}
        {qrCodeUrl && (
          <a
            href={qrCodeUrl}
            download="qrcode_backmarket.png"
            className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm"
          >
            Télécharger le QR Code seul (PNG)
          </a>
        )}

        {/* Informations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
          <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Informations</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Le QR code redirige automatiquement vers la section MacBook de Back Market</li>
            <li>• Le PDF contiendra votre texte et le QR code</li>
            <li>• Le fichier PDF sera automatiquement téléchargé</li>
          </ul>
        </div>
      </main>
    </div>
  );
}