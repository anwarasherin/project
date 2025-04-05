import * as z from "zod";
import { login } from "../../redux/slices/userSlice";

export const loginSchema = z.object({
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

export const loginUser = async (
  userData,
  dispatch,
  navigate,
  setSubmissionErrorMessage,
  setSubmissionLoading
) => {
  setSubmissionLoading(true);
  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      setSubmissionErrorMessage(errorData.message || "Login failed");
      return;
    }

    const { user, token } = await res.json();
    dispatch(login({ user, token }));
    navigate("/dashboard");
  } catch (error) {
    setSubmissionErrorMessage(error.message);
  } finally {
    setSubmissionLoading(false);
  }
};
