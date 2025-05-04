import { API_URL } from "../../utils/constants";

export const sendPublicKey = async (
  eccPublicKey,
  setSubmissionErrorMessage,
  setSubmissionLoading,
  token
) => {
  setSubmissionLoading(true);
  try {
    const res = await fetch(API_URL + "/users/store-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ eccPublicKey: eccPublicKey }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      setSubmissionErrorMessage(
        errorData.message || "ECC Public Key Operation failed"
      );

      return;
    }
  } catch (error) {
    setSubmissionErrorMessage(error.message);
  } finally {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
    setSubmissionLoading(false);
  }
};
