"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isProcessing, setIsProcessing] = useState(true);
  const router = useRouter();
  useEffect(() => {
    async function fetchUserFromToken() {
      try {
        const verifyUserFromToken = await axios.post(
          `${process.env.NEXT_PUBLIC_USERS_API_URL}/verify-user`,
          {token},
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
  }, []);
  return (
    <Suspense fallback={null}>
      <div className="min-h-screen flex justify-center items-center">
        {isProcessing ? (
          <h1 className="text-4xl font-extrabold md:text-5xl lg:text-6xl text-center leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-500 from-35% via-pink-600 to-purple-600 ">
              Parsing Token...
            </span>
          </h1>
        ) : (
          <button
            className="button1 !p-2 bg-purple-700 !rounded-xl hover:bg-gray-800"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        )}
      </div>
    </Suspense>
  );
}

export default VerifyEmail;
