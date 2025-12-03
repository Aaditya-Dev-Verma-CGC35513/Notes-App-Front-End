"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function ForgotPasswordVerify() {
    const [email, setEmail] = useState("");
    const router = useRouter();
    async function handleSubmit() {
        try {
            const verifyEmailForPassword = await axios.post(
                `${process.env.NEXT_PUBLIC_USERS_API_URL}/forgot-password-verify`,
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
    <div className="min-h-screen flex justify-center items-center gap-2 flex-col">
      <label htmlFor="email">Enter Your Email</label>
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
      <button
        type="button"
        className="button1 bg-purple-700 hover:bg-gray-800 
              disabled:bg-purple-800
              disabled:hover:bg-purple-900
              "
        disabled={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}

export default ForgotPasswordVerify