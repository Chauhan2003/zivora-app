import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userRoute } from "../utils/routes";
import { login } from "../context/userSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError("Invalid or missing token.");
        return;
      }

      try {
        const res = await axios.get(`${userRoute}/verify-email/${token}`);

        if (res?.status === 200) {
          Cookies.set("zivora_access_token", res?.data?.accessToken, {
            expires: 1,
            secure: true,
            sameSite: "Strict",
          });

          dispatch(login(res?.data?.data));
          toast.success(res?.data?.message);
          navigate("/");
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Something went wrong");
        navigate("/accounts/login");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="w-full h-screen flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 border rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-sm text-center">
        <div className="text-center">
          <h1 className="font-bold text-lg">Verifying your email</h1>
          <p className="text-sm text-center text-gray-600">
            Please wait while we confirm your email address.
          </p>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <Spinner className="w-8 h-8 text-[#4150F7]" />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
