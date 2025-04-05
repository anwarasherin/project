import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import AuthForm from "../common/AuthForm";
import { signUpSchema, signUpUser } from "./helper";

function SignUp() {
  const navigate = useNavigate();
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState(null);
  const [isSubmissionLoading, setSubmissionLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", role: "student" },
  });

  const onSubmit = (data) => {
    signUpUser(data, navigate, setSubmissionErrorMessage, setSubmissionLoading);
  };

  return (
    <div className="flex flex-row justify-center items-center w-screen h-screen p-8 gap-16">
      <AuthForm
        type="signup"
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        submissionErrorMessage={submissionErrorMessage}
        isSubmissionLoading={isSubmissionLoading}
      />
    </div>
  );
}

export default SignUp;
