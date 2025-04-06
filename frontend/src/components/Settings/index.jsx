import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LuLoaderCircle } from "react-icons/lu";

import Button from "../common/Button";
import PageTitle from "../common/PageTitle";
import Modal from "../common/Modal";
import { generateECCKeyPairs, initializeEC } from "../../utils";
import { sendPublicKey } from "./helper";

function Settings() {
  const token = useSelector((state) => state.user.token);
  const [isSubmissionLoading, setSubmissionLoading] = useState(false);
  const [isSubmissionErrorMessage, setSubmissionErrorMessage] = useState(null);

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

    sendPublicKey(
      publicKeyPEM,
      setSubmissionErrorMessage,
      setSubmissionLoading,
      token
    );
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
      <Modal
        isOpen={isSubmissionLoading}
        close={() => isSubmissionLoading(false)}
      >
        <div className="flex flex-row justify-center gap-2 items-center">
          <LuLoaderCircle className="h-5 w-5 animate-spin text-blue-700" />
          <span>Storing...</span>
        </div>
      </Modal>
    </div>
  );
}

export default Settings;
