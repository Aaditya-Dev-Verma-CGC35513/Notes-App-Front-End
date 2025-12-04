"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import axios from "axios";
import toast from "react-hot-toast";

function ForgotPasswordVerify() {
    const [email, setEmail] = useState("");
    const router = useRouter();
    async function handleSubmit() {
        try {
            const verifyEmailForPassword = await axios.post(
                `${process.env.NEXT_PUBLIC_USERS_API_URL}/forgot-password`,
                {email},
            )
            toast.success(verifyEmailForPassword.data.message);
            router.push("/login");
        } catch (error) {
            if (error.response) {
              toast.error(error.response.data.detail);
            } else {
              toast.error(error.message);
            }
        }
    }
  return (
    <div className="min-h-screen flex justify-center items-center gap-8 flex-col text-lg">
      <section className="flex flex-col gap-4">
        <label htmlFor="email" className='text-center'>Enter Your Email</label>
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
      <button
        className="button1 bg-purple-700 hover:bg-gray-800"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}

export default ForgotPasswordVerify