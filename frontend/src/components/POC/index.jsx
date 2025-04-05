import { useEffect, useState } from "react";
import {
  decryptWithECC,
  encryptWithECC,
  generateECCKeyPairs,
  initializeEC,
} from "../../utils";

function POC() {
  const [publicKeyPem, setPublicKeyPem] = useState("");
  const [privateKeyPem, setPrivateKeyPem] = useState("");

  const handlePublicKeyPemFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPublicKeyPem(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handlePrivateKeyPemFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPrivateKeyPem(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleFileUpload = () => {
    const message = "Hello from ECC encryption!";

    // Encrypt the message
    const { encryptedMessage, ephemeralPublicKeyPEM } = encryptWithECC(
      publicKeyPem,
      message
    );
    console.log("Encrypted Message:", encryptedMessage);
    console.log("Ephemeral Public Key:\n", ephemeralPublicKeyPEM);

    // Decrypt the message
    const decryptedMessage = decryptWithECC(
      privateKeyPem,
      encryptedMessage,
      ephemeralPublicKeyPEM
    );
    console.log("Decrypted Message:", decryptedMessage);
  };

  function downloadPEMFile(pemContent, fileName) {
    const blob = new Blob([pemContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const generateKeyPairs = () => {
    const { privateKeyPEM, publicKeyPEM } = generateECCKeyPairs();

    downloadPEMFile(privateKeyPEM, "private_key.pem");
    downloadPEMFile(publicKeyPEM, "public_key.pem");
  };

  useEffect(() => {
    initializeEC();
  }, []);

  return (
    <div>
      <h3>Generate Keys</h3>
      <button onClick={generateKeyPairs}>Generate ECC Keys</button>

      <h3>Upload a PEM File</h3>
      <input
        type="file"
        accept=".pem"
        onChange={handlePublicKeyPemFileUpload}
      />
      <input
        type="file"
        accept=".pem"
        onChange={handlePrivateKeyPemFileUpload}
      />
      <button onClick={() => handleFileUpload()}>Submit</button>
    </div>
  );
}

export default POC;
