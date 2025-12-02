"use client";

import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { redirect } from "next/navigation";

function Signup() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const [first_name, setFirstname] = useState("");
  const [last_name, setLastname] = useState("");
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
    if (first_name && last_name && email && password) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [first_name, last_name, email, password]);
  async function handleSignup(e) {
    try {
      e.preventDefault();
      const signupUser = await axios.post(
        `${process.env.NEXT_PUBLIC_USERS_API_URL}/signup`,
        {
          first_name,
          last_name,
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      toast.success(signupUser.data.message);
      router.push("/login");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.detail);
      } else {
        toast.error(error.message);
      }
    } finally {
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
    }
  }
  if (fetchingToken) {
    return null;
  }
  return (
    <div className="min-h-screen bg-black  justify-center items-center flex flex-col gap-6">
      <h1 className="text-3xl text-transparent bg-clip-text bg-linear-to-b from-30% from-purple-700 to-white font-bold">
        Signup
      </h1>
      <div
        className="bg-[#1a1a1a] py-4 pl-4 pr-1 rounded-xl border-2 border-purple-950 grid grid-cols-[1fr_auto] gap-x-1"
        style={{ boxShadow: "0px 0px 55px rgba(75,0,130, 1)" }}
      >
        <form
          className="flex flex-col gap-4 col-start-1"
          onSubmit={(e) => handleSignup(e)}
        >
          <section className="flex flex-col gap-2">
            <label htmlFor="firstname" className="font-bold">
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              placeholder="Enter First Name"
              className="input1"
              value={first_name}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </section>
          <section className="flex flex-col gap-2">
            <label htmlFor="lastname" className="font-bold">
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              placeholder="Enter Last Name"
              className="input1"
              value={last_name}
              onChange={(e) => setLastname(e.target.value)}
            />
          </section>
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
              onChange={(e) => setEmail(e.target.value)}
            />
          </section>
          <section className="flex flex-col gap-2">
            <label htmlFor="password" className="font-bold">
              Password
            </label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              className="input1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </section>
          <section className="flex flex-col gap-6 mt-2">
            <button
              type="submit"
              className="button1 bg-purple-700 rounded-lg hover:bg-gray-800 disabled:bg-purple-800
              disabled:hover:bg-purple-900"
              disabled={isButtonDisabled}
            >
              Signup
            </button>
            <section className="flex flex-col gap-3">
              <button
                type="button"
                className="button1 bg-gray-800 hover:bg-purple-700"
                onClick={() => {
                  router.push("/login");
                }}
              >
                Login
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
        <section className="col-start-2 place-content-center ">
          <IconEye
            size={25}
            className={`${
              isPasswordVisible ? "hidden" : "block"
            } icon translate-y-[46px]`}
            onClick={() => {
              setIsPasswordVisible(!isPasswordVisible);
            }}
          />
          <IconEyeOff
            size={25}
            className={`${
              isPasswordVisible ? "block" : "hidden"
            } icon translate-y-[46px]`}
            onClick={() => {
              setIsPasswordVisible(!isPasswordVisible);
            }}
          />
        </section>
      </div>
    </div>
  );
}

export default Signup;
