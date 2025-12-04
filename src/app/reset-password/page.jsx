"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(true);
  const router = useRouter();
  const [token, setToken] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
  }, []);
  useEffect(() => {
    async function fetchUserFromToken() {
      if (token == "") return;
      
      try {
        const verifyUserFromToken = await axios.post(
          `${process.env.NEXT_PUBLIC_USERS_API_URL}/verify-user`,
          { token },
          {
            headers: {  
              tokenType: "ResetPassword",
            },
          }
        );

        toast.success(verifyUserFromToken.data.message);
        setIsProcessing(false);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.detail);
        } else {
          toast.error(error.message);
        }
      }
    }
    fetchUserFromToken();
  }, [token]);
  async function handleResetPassword() {
    try {
      if(newPassword != confirmNewPassword){
        toast.error("Passwords do not match");
        return
      }
      const resetPassword = await axios.post(
        `${process.env.NEXT_PUBLIC_USERS_API_URL}/reset-password`,
        {
          password:newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(resetPassword.data.message);
      router.push("/login");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.detail);
      } else {
        toast.error(error.message);
      }
    } finally {
      setNewPassword("");
      setConfirmNewPassword("");
    }
  }
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4">
      {isProcessing ? (
        <h1 className="text-4xl font-extrabold md:text-5xl lg:text-6xl text-center leading-tight">
          <span className="text-transparent bg-clip-text bg-linear-to-br from-orange-500 from-35% via-pink-600 to-purple-600 ">
            Parsing Token...
          </span>
        </h1>
      ) : (
        <div className=" flex flex-col justify-center items-center gap-6">
          <section className="flex flex-col gap-4">
            <label htmlFor="NewPassword">New Password</label>
            <section className="flex gap-2 items-center">
              <input
                type={isPasswordVisible ? "text" : "password"}
                className="input1"
                name="NewPassword"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
              />
              <IconEye
                size={25}
                className={`${
                  isPasswordVisible ? "hidden" : "block"
                } icon`}
                onClick={() => {
                  setIsPasswordVisible(!isPasswordVisible);
                }}
              />
              <IconEyeOff
                size={25}
                className={`${
                  isPasswordVisible ? "block" : "hidden"
                } icon`}
                onClick={() => {
                  setIsPasswordVisible(!isPasswordVisible);
                }}
              />
            </section>
          </section>
          <section className="flex flex-col gap-2">
            <label htmlFor="ConfirmNewPassword">Confirm New Password</label>
            <section className="flex gap-2 items-center">
              <input
                type={isPasswordVisible1 ? "text" : "password"}
                className="input1"
                name="ConfirmNewPassword"
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                }}
              />
              <IconEye
                size={25}
                className={`${
                  isPasswordVisible1 ? "hidden" : "block"
                } icon`}
                onClick={() => {
                  setIsPasswordVisible1(!isPasswordVisible1);
                }}
              />
              <IconEyeOff
                size={25}
                className={`${
                  isPasswordVisible1 ? "block" : "hidden"
                } icon`}
                onClick={() => {
                  setIsPasswordVisible1(!isPasswordVisible1);
                }}
              />
            </section>
          </section>
          <button
            type="submit"
            className="button1 bg-purple-700 hover:bg-gray-800 "
            onClick={handleResetPassword}
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}

export default ResetPassword;
