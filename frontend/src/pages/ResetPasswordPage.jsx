import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useState } from "react";
import axios from "axios";
import { userRoute } from "../utils/routes";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState({
    password: "",
    confirmPassword: "",
  });

  const { token } = useParams();
  const navigate = useNavigate();

  const handlePayload = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const passwordErrors = validatePassword(payload.password);
    if (passwordErrors.length > 0) {
      setErrors({ password: passwordErrors[0] });
      setLoading(false);
      return;
    }

    const confirmPasswordErrors = validateConfirmPassword(payload.password, payload.confirmPassword);
    if (confirmPasswordErrors.length > 0) {
      setErrors({ confirmPassword: confirmPasswordErrors[0] });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${userRoute}/reset-password/${token}`, {
        password: payload.password,
      });
      if (res?.status === 200) {
        toast.success(res?.data?.message);
        navigate("/accounts/login");
      }
    } catch (err) {
      console.error(err);
      setErrors({
        general: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center px-4">
      <form
        className="flex flex-col items-center gap-4 bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-sm text-center"
        onSubmit={handleResetPassword}
      >
        <Lock strokeWidth={1} size={100} />
        <div className="text-center">
          <h1 className="font-bold text-lg">Reset Password</h1>
          <p className="text-sm text-center text-gray-600">
            Please enter your new password.
          </p>
        </div>
        <InputGroup>
          <InputGroupInput
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={payload.password}
            onChange={handlePayload}
          />
          {showPassword ? (
            <InputGroupAddon
              align="inline-end"
              className="cursor-pointer"
              onClick={() => setShowPassword(false)}
            >
              <EyeOff />
            </InputGroupAddon>
          ) : (
            <InputGroupAddon
              align="inline-end"
              className="cursor-pointer"
              onClick={() => setShowPassword(true)}
            >
              <Eye />
            </InputGroupAddon>
          )}
          {errors.password && (
            <span className="text-xs text-red-500 mt-1">{errors.password}</span>
          )}
        </InputGroup>

        <InputGroup>
          <InputGroupInput
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={payload.confirmPassword}
            onChange={handlePayload}
          />
          {errors.confirmPassword && (
            <span className="text-xs text-red-500 mt-1">{errors.confirmPassword}</span>
          )}
        </InputGroup>

        <Button
          className="w-full bg-blue-700 cursor-pointer"
          type="submit"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Reset Password"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
