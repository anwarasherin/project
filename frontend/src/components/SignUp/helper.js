import * as z from "zod";
import { API_URL } from "../../utils/constants";

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[A-Za-z\s]+$/, "Name should only contain letters and spaces"),
  email: z
    .string()
    .min(5, "Email is required")
    .max(32, "Email must be less than 32 characters")
    .email("Invalid email format"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(24, "Password must be less than 24 characters"),
});

export const signUpUser = async (
  userData,
  navigate,
  setSubmissionErrorMessage,
  setSubmissionLoading
) => {
  setSubmissionLoading(true);

  try {
    const res = await fetch(API_URL + "/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      setSubmissionErrorMessage(errorData.message || "Login failed");
      return;
    }

    navigate("/login");
  } catch (error) {
    setSubmissionErrorMessage(error.message);
  } finally {
    setSubmissionLoading(false);
  }
};
