import { useEffect, useState } from "react";
import { X, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { verifyOtp, sendOtp } from "../../services/authService";
import OtpInput from "./OtpInput";

const OtpModal = ({ email, userData,onClose }) => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(30);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Verify OTP
  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      return toast.error("Please enter complete OTP");
    }

    try {
      setLoading(true);

      const res = await verifyOtp({
        email,
        otp: otpCode,
      });

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      toast.success("Registration Successful");

      onClose();

      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "OTP Verification Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      setResending(true);

     await sendOtp(userData);

      toast.success("OTP sent successfully");

      setOtp(["", "", "", "", "", ""]);
      setTimer(30);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to resend OTP"
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-5">

      <div className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-zinc-500 hover:text-white transition"
        >
          <X size={22} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/20">
            <ShieldCheck
              size={32}
              className="text-red-500"
            />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-center text-3xl font-bold text-white">
          Verify Email
        </h2>

        <p className="mt-2 text-center text-zinc-400">
          We've sent a verification code to
        </p>

        <p className="mt-1 text-center font-semibold text-red-500 break-all">
          {email}
        </p>

        {/* OTP Boxes */}
        <OtpInput
          otp={otp}
          setOtp={setOtp}
        />

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="mt-8 flex w-full items-center justify-center rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Verify OTP"
          )}
        </button>

        {/* Resend */}
        <div className="mt-5 text-center">

          {timer > 0 ? (
            <p className="text-sm text-zinc-400">
              Resend OTP in{" "}
              <span className="font-semibold text-red-500">
                {timer}s
              </span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="font-semibold text-red-500 transition hover:text-red-400 disabled:opacity-60"
            >
              {resending ? (
                <>
                  <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend OTP"
              )}
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default OtpModal;