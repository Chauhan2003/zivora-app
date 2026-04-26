import { useNavigate } from "react-router-dom";
import EmailIcon from "@/assets/emailIcon.svg";

const CheckInboxPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 border rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md text-center">
        <img
          src={EmailIcon}
          className="w-36 object-contain mb-2"
          alt="Email Icon"
        />

        <h1 className="font-semibold text-xl">Check your inbox</h1>

        <p className="text-gray-600 text-sm leading-relaxed">
          We’ve sent a verification link to your email address. Please open your
          inbox and click the link to confirm your account.
        </p>

        <button
          className="text-[#4150F7] font-medium hover:underline mt-2 transition-all cursor-pointer"
          onClick={() => navigate("/accounts/login")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default CheckInboxPage;
