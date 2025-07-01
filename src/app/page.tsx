'use client'
import { useState } from "react";
import QRCode from "qrcode";

export default function Home() {
  const [username, setUsername] = useState<string>('');
  const [src, setSrc] = useState<string>('')

  const generate = () => {
    QRCode.toDataUrl("https://github.com").then(setSrc)
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="row-start-1">
        <h1 className="text-4xl font-bold">QR Code Generator</h1>
      </header>
      <main className="row-start-2">
        <img src={src} alt="" />
        {/* input field */}
        <input
          type="text"
          name="qr-code-input"
          id="qr-code-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* bouton de génération */}
        <button
          type="button"
          onClick={generate}
        ></button>
      </main>

    </div>
  );
}
