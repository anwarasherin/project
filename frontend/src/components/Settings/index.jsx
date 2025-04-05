import Button from "../common/Button";
import PageTitle from "../common/PageTitle";
import { generateECCKeyPairs, initializeEC } from "../../utils";
import { useEffect } from "react";

function Settings() {
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

  const handleCreateECKeyPairs = () => {
    const { privateKeyPEM, publicKeyPEM } = generateECCKeyPairs();

    downloadPEMFile(privateKeyPEM, "private_key.pem");
    downloadPEMFile(publicKeyPEM, "public_key.pem");
  };

  useEffect(() => {
    initializeEC();
  }, []);

  return (
    <div className="p-6 flex flex-col gap-8">
      <PageTitle title="Settings" />
      <div className="flex flex-row">
        <Button onClick={handleCreateECKeyPairs}>Create EC Key Pair</Button>
      </div>
    </div>
  );
}

export default Settings;
