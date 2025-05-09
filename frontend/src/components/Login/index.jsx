import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import AuthForm from "../common/AuthForm";
import { loginSchema, loginUser } from "./helper";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState(null);
  const [isSubmissionLoading, setSubmissionLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data) => {
    loginUser(
      data,
      dispatch,
      navigate,
      setSubmissionErrorMessage,
      setSubmissionLoading
    );
  };

  return (
    <div className="flex flex-row justify-center items-center w-screen h-screen p-8 gap-16">
      <AuthForm
        type="login"
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        submissionErrorMessage={submissionErrorMessage}
        isSubmissionLoading={isSubmissionLoading}
      />
    </div>
  );
}

export default Login;
