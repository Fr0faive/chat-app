"use client";
import {
  EmailOutlined,
  PasswordOutlined,
  Person2Outlined,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

const Form = ({ types }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    if (types === "register") {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setLoading(false);
        router.push("/");
      }

      if (res.errors) {
        toast.error("Something went wrong");
        setLoading(false);
      }
    }

    if (types === "login") {
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (res.ok) {
        router.push("/chats");
      }

      if (res.error) {
        toast.error("Invalid email or password");
      }
    }
  };

  return (
    <div className="auth">
      <div className="content">
        <h1 className="text-heading2-bold">
          Chatify - {types === "register" ? "Register" : "Login"}
        </h1>

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          {types === "register" && (
            <div>
              <div className="input">
                <input
                  defaultValue={""}
                  {...register("username", {
                    required: "Username is required",
                    validate: (value) => {
                      if (value.length < 3)
                        return "Username must be at least 3 characters";
                    },
                  })}
                  type="text"
                  placeholder="Username"
                  className="input-field"
                />
                <Person2Outlined sx={{ color: "#737373" }} />
              </div>
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
            </div>
          )}
          <div>
            <div className="input">
              <input
                defaultValue={""}
                {...register("email", {
                  required: "Email is required",
                  validate: (value) => {
                    if (!value.includes("@")) return "Email is not valid";
                  },
                })}
                type="email"
                placeholder="Email"
                className="input-field"
              />
              <EmailOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <div className="input">
              <input
                defaultValue={""}
                {...register("password", {
                  required: "Password is required",
                  validate: (value) => {
                    if (value.length < 8)
                      return "Password must be at least 8 characters";
                  },
                })}
                type="password"
                placeholder="Password"
                className="input-field"
              />
              <PasswordOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <button className="button" type="submit" disabled={loading}>
            {types === "register" ? "Register" : "Login"}
          </button>
        </form>
        {types === "register" ? (
          <Link href={"/"} className="link">
            <p className="text-center">Already have an account? Login</p>
          </Link>
        ) : (
          <Link href={"/register"} className="link">
            <p className="text-center">Dont have an account? Register</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Form;
