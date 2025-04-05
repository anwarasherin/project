import { LuLoaderCircle } from "react-icons/lu";

import TextInput from "../TextInput";
import Button from "../Button";
import ErrorMessage from "../ErrorMessage";

export default function AuthForm({
  type,
  onSubmit,
  register,
  errors,
  submissionErrorMessage,
  isSubmissionLoading,
}) {
  const isSignUp = type === "signup";

  return (
    <div className="flex flex-col justify-center items-center max-w-96">
      <HeaderText type={type} />
      <div className="w-96 flex flex-col items-center rounded-2xl gap-2 px-4 border border-gray-200 shadow-sm bg-white">
        <div className="w-full pt-4">
          <FormFields isSignUp={isSignUp} register={register} errors={errors} />
        </div>
        {submissionErrorMessage && (
          <p className="text-red-600 text-sm">{submissionErrorMessage}</p>
        )}
        <div className="w-full flex mt-4 mb-2 flex-col gap-2 items-center">
          <Button onClick={onSubmit} className="w-full flex justify-center">
            {isSubmissionLoading ? (
              <LuLoaderCircle className="h-5 w-5 animate-spin text-white" />
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Login"
            )}
          </Button>
          <a
            href={isSignUp ? "/login" : "/signup"}
            className="text-sm text-gray-500"
          >
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </a>
        </div>
      </div>
    </div>
  );
}

const HeaderText = ({ type }) => {
  return (
    <>
      <h2 className="text-4xl text-black font-bold my-4">Welcome!</h2>
      <p className="my-4 text-gray-500">
        Please {type === "signup" ? "create" : "log into"} your account:
      </p>
    </>
  );
};

const FormFields = ({ isSignUp, register, errors }) => {
  const commonInputProps = {
    fieldClass: "flex flex-col w-full",
    labelClass: "text-black font-bold",
    inputClass: "border border-gray-400 h-9 rounded-md w-full px-2",
  };

  return (
    <>
      {isSignUp && (
        <TextInput label="Name" {...register("name")} {...commonInputProps} />
      )}
      {errors.name && <ErrorMessage message={errors.name.message} />}

      <TextInput label="Email" {...register("email")} {...commonInputProps} />
      {errors.email && <ErrorMessage message={errors.email.message} />}

      <TextInput
        label="Password"
        type="password"
        {...register("password")}
        {...commonInputProps}
      />
      {errors.password && <ErrorMessage message={errors.password.message} />}
    </>
  );
};
