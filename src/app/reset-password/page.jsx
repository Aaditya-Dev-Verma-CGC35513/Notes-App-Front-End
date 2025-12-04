import { headers } from 'next/headers';
import { useRouter } from 'next/router';
import React, { useState } from 'react'

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(true);
  const router = useRouter();
  const [token, setToken] = useState("");
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
          { token }
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
      const resetPassword = await axios.post(
        `${process.env.NEXT_PUBLIC_USERS_API_URL}/reset_password`,
        {
          newPassword,
          confirmNewPassword,
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
    }
  }
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4">
      <section className="flex flex-col gap-2">
        <label htmlFor="NewPassword">New Password</label>
        <input
          type="password"
          className="input1"
          name="NewPassword"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
        />
      </section>
      <section className="flex flex-col gap-2">
        <label htmlFor="ConfirmNewPassword">Confirm New Password</label>
        <input
          type="password"
          className="input1"
          name="ConfirmNewPassword"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => {
            setConfirmNewPassword(e.target.value);
          }}
        />
      </section>
      <button
        type="submit"
        className="button1 bg-purple-700 hover:bg-gray-800"
        disabled={handleResetPassword}
      >
        Login
      </button>
    </div>
  );
}

export default ResetPassword