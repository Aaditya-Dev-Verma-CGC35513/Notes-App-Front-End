"use client";

import { IconEye, IconEyeOff } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fetchingToken, setFetchingToken] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      redirect("/home");
    }
    setFetchingToken(false);
  }, []);
  useEffect(() => {
    if (email && password) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [email, password]);
  async function handleLogin(e) {
    try {
      e.preventDefault();
      const loginUser = await axios.post(
        `${process.env.NEXT_PUBLIC_USERS_API_URL}/login`,
        {
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      toast.success(loginUser.data.message);

      localStorage.setItem("access_token", loginUser.data.token);
      router.push("/home");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.detail);
      } else {
        toast.error(error.message);
      }
    } finally {
      setEmail("");
      setPassword("");
    }
  }
  if (fetchingToken) {
    return null;
  }
  return (
    <div className="min-h-screen bg-black flex justify-center items-center flex-col gap-6">
      <h1 className="text-3xl text-transparent bg-clip-text bg-linear-to-b from-30% from-purple-700 to-white font-bold">
        Login
      </h1>
      <div
        className="bg-[#1a1a1a] py-4 pl-4 pr-1 rounded-xl border-2 border-purple-950 grid grid-cols-[1fr_auto] gap-x-1"
        style={{ boxShadow: "0px 0px 55px rgba(75,0,130, 1)" }}
      >
        <form
          className="flex flex-col gap-4 col-start-1"
          onSubmit={(e) => {
            handleLogin(e);
          }}
        >
          <section className="flex flex-col gap-2">
            <label htmlFor="email" className="font-bold">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className="input1"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </section>
          <section className="flex flex-col gap-2">
            <label htmlFor="password" className="font-bold">
              Password
            </label>
            <section className="flex gap-2 justify-center items-center">
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                className="input1"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </section>
          </section>
          <section className="flex flex-col gap-6 mt-2">
            <button
              type="submit"
              className="button1 bg-purple-700 hover:bg-gray-800 
              disabled:bg-purple-800
              disabled:hover:bg-purple-900
              "
              disabled={isButtonDisabled}
            >
              Login
            </button>
            <button
              type="button"
              className="button1 bg-purple-700 hover:bg-gray-800 
              disabled:bg-purple-800
              disabled:hover:bg-purple-900
              "
              onClick={()=>router.push("/forgot-password-verify")}
            >
              Forgot Password
            </button>
            <section className="flex flex-col gap-3">
              <button
                type="button"
                className="button1 bg-gray-800 hover:bg-purple-700"
                onClick={() => {
                  router.push("/signup");
                }}
              >
                Signup
              </button>
              <button
                type="button"
                className="button1 bg-gray-800 hover:bg-purple-700"
                onClick={() => {
                  router.push("/");
                }}
              >
                Home
              </button>
            </section>
          </section>
        </form>
        <section className="col-start-2 place-content-center mb-1">
          <IconEye
            size={25}
            className={`${
              isPasswordVisible ? "hidden" : "block"
            } icon -translate-y-16`}
            onClick={() => {
              setIsPasswordVisible(!isPasswordVisible);
            }}
          />
          <IconEyeOff
            size={25}
            className={`${
              isPasswordVisible ? "block" : "hidden"
            } icon -translate-y-16`}
            onClick={() => {
              setIsPasswordVisible(!isPasswordVisible);
            }}
          />
        </section>
      </div>
    </div>
  );
}

export default Login;
