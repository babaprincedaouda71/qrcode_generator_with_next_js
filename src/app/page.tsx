'use client'
import { useState } from "react";
import QRCode from "qrcode";

export default function Home() {
  const [text, setText] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const generateQRCode = async () => {
    if (!text.trim()) {
      alert('Veuillez saisir du texte pour générer le QR code');
      return;
    }

    try {
      const url = await QRCode.toDataURL("https://github.com/", {
        width: 256,
        margin: 2,
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

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="row-start-1">
        <h1 className="text-4xl font-bold">Générateur de QR Code</h1>
      </header>

      <main className="row-start-2 flex flex-col items-center gap-6">
        {/* Affichage conditionnel de l'image QR code */}
        {qrCodeUrl && (
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <img
              src={qrCodeUrl}
              alt="QR Code généré"
              className="max-w-full h-auto"
            />
          </div>
        )}

        {/* Champ de saisie */}
        <div className="flex flex-col gap-2">
          <label htmlFor="qr-code-input" className="font-medium">
            Texte ou URL à encoder :
          </label>
          <input
            type="text"
            id="qr-code-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Entrez votre texte ou URL..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[300px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                generateQRCode();
              }
            }}
          />
        </div>

        {/* Bouton de génération */}
        <button
          type="button"
          onClick={generateQRCode}
          disabled={!text.trim()}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Générer le QR Code
        </button>

        {/* Bouton de téléchargement */}
        {qrCodeUrl && (
          <a
            href={qrCodeUrl}
            download="qrcode.png"
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Télécharger le QR Code
          </a>
        )}
      </main>
    </div>
  );
}