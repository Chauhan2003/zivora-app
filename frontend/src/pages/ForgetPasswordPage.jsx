import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userRoute } from "../utils/routes";
import toast from "react-hot-toast";
import { validateUsernameOrEmail } from "../utils/validation";

const ForgetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    usernameOrEmail: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handlePayload = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetPasswordLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await axios.get(
        `${userRoute}/forget-password/${payload.usernameOrEmail}`
      );
      if (res?.status === 200) {
        console.log("Reset password link send successfully!");
        toast.success("Password reset link send successfully");
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
        onSubmit={handleResetPasswordLink}
      >
        <Shield strokeWidth={1} size={100} />
        <div className="text-center">
          <h2 className="font-bold text-lg">Trouble logging in?</h2>
          <p className="text-sm text-center text-gray-600">
            Enter your email or username and we'll send you a reset password
            link.
          </p>
        </div>
        <InputGroup>
          <InputGroupInput
            type="text"
            name="usernameOrEmail"
            placeholder="Email / Username"
            value={payload.usernameOrEmail}
            onChange={handlePayload}
          />
          {errors.usernameOrEmail && (
            <span className="text-xs text-red-500 mt-1">{errors.usernameOrEmail}</span>
          )}
        </InputGroup>
        <Button
          className="w-full bg-blue-700 cursor-pointer"
          type="submit"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Send"}
        </Button>

        <div className="flex items-center gap-4 my-3 w-full">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        <Button
          className="w-full"
          variant="outline"
          onClick={() => navigate("/accounts/login")}
        >
          Back to Login
        </Button>
      </form>
    </div>
  );
};

export default ForgetPasswordPage;
