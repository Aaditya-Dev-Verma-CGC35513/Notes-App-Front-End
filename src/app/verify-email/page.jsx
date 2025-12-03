"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const dynamic = "force-dynamic"; // prevent prerendering

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isProcessing, setIsProcessing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      toast.error("Token not found");
      setIsProcessing(false);
      return;
    }

    async function verifyToken() {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_USERS_API_URL}/verify-user`,
          { token }
        );
        toast.success(res.data.message);
      } catch (err) {
        if (err.response) toast.error(err.response.data.detail);
        else toast.error(err.message);
      } finally {
        setIsProcessing(false);
      }
    }

    verifyToken();
  }, [token]);

  return (
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
  );
}
