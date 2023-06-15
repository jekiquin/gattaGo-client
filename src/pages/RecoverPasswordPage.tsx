//  ***   To-do: Handle user password update    ***

import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface RecoverPasswordProps {
  email: String;
  setEmail: Function;
}

const RecoverPasswordPage = ({
  email,
  setEmail,
}: RecoverPasswordProps): JSX.Element => {
  const [isPasswordSent, setIsPasswordSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email,
    },
  });
  return (
    <div className="w-full tablet:w-[448px] mx-auto mb-20">
      <h3 className="text-center my-4 mx-2.5 tablet:mx-5 tablet:mt-10 tablet:mb-5 tablet:text-2xl">
        Recover Your Password
      </h3>

      <p className="m-5 mt-2.5 max-w-[448px] mx-auto tablet:mb-8 px-2.5 tablet:px-5 text-center">
        {isPasswordSent
          ? "Password reset sent!"
          : "Enter the email you signed up with and we'll send a password reset. Make sure this is the email you signed up with!"}
      </p>
      {!isPasswordSent ? (
        <form
          onSubmit={handleSubmit(({ email }) => {
            setEmail(email);
            setIsPasswordSent(true);
          })}
          className="max-w-[448px] m-auto px-2.5 tablet:px-5 py-6 bg-white border border-gray-border rounded"
        >
          <div className="flex flex-col mb-2.5">
            <label htmlFor="email" className="mb-1 font-bold">
              Email
            </label>
            <input
              type="text"
              {...register("email", {
                required: {
                  value: true,
                  message: "Email field can't be empty!",
                },
                pattern: {
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                  message: "Field needs to be an email!",
                },
              })}
              id="email"
              placeholder="Input email address"
              className="mb-1 px-2 py-2.5 bg-white-dark border border-gray-border rounded focus:outline-blue-light"
            />
            <p className="text-red-500 text-left">{errors.email?.message}</p>
          </div>
          <div className="flex flex-row space-x-2 tablet:space-x-3 mt-4">
            <button className="p-4 w-full text-white bg-green-light hover:bg-green-dark rounded">
              <p>Reset Password</p>
            </button>
            <Link
              to="../login"
              className="p-4 w-full text-center flex justify-center items-center text-white bg-orange-light hover:bg-orange-dark rounded"
            >
              <p>Cancel</p>
            </Link>
          </div>
        </form>
      ) : (
        <Link
          to="../login"
          className="flex justify-center max-w-[448px] p-4 mx-4 text-white bg-green-light hover:bg-green-dark rounded"
        >
          Back to Login Page
        </Link>
      )}
    </div>
  );
};

export default RecoverPasswordPage;
