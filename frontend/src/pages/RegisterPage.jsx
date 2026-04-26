import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { CheckIcon, Eye, EyeOff, X, CircleAlert } from "lucide-react";
import axios from "axios";
import { authRoute, userRoute } from "../utils/routes";
import { validateRegisterPayload, validateUsername } from "../utils/validation";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [isValidUsername, setIsValidUsername] = useState(null);
  const [isValidLoading, setIsValidLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!payload.username) {
      setIsValidUsername(null);
      setIsValidLoading(false);
      return;
    }

    if (payload.username.length < 3 || payload.username.length > 30) {
      setIsValidUsername(false);
      setIsValidLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9._]+$/.test(payload.username)) {
      setIsValidUsername(false);
      setIsValidLoading(false);
      return;
    }

    if (/^\d+$/.test(payload.username)) {
      setIsValidUsername(false);
      setIsValidLoading(false);
      return;
    }

    setIsValidLoading(true);

    const debounce = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${authRoute}/check-username/${payload.username}`
        );

        if (res?.status === 200) {
          setIsValidUsername(true);
        }
      } catch (err) {
        setIsValidUsername(false);
      } finally {
        setIsValidLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [payload.username]);

  const handlePayload = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const validationErrors = validateRegisterPayload(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerPayload } = payload;
      const res = await axios.post(`${authRoute}/register`, registerPayload);
      if (res?.status === 201) {
        navigate("/accounts/check/inbox");
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
    <div className="w-full max-w-xs">
      <h1 className="font-bold text-xl mb-4">Sign Up</h1>

      <form className="flex flex-col gap-3" onSubmit={handleRegister}>
        {errors.general && (
          <div className="p-3 text-sm bg-red-500/20 text-red-500 rounded-md flex items-center gap-2">
            <CircleAlert size={20} />
            {errors.general}
          </div>
        )}

        <div>
          <InputGroup>
            <InputGroupInput
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={payload.fullName}
              onChange={handlePayload}
            />
          </InputGroup>
          {errors.fullName && (
            <span className="text-xs text-red-500 mt-1">{errors.fullName}</span>
          )}
        </div>

        <div>
          <InputGroup>
            <InputGroupInput
              type="text"
              name="username"
              placeholder="Username"
              value={payload.username}
              onChange={handlePayload}
            />
            {isValidUsername !== null && (
              <InputGroupAddon align="inline-end">
                {isValidLoading ? (
                  <Spinner />
                ) : isValidUsername ? (
                  <CheckIcon />
                ) : (
                  <X />
                )}
              </InputGroupAddon>
            )}
          </InputGroup>
          {errors.username && (
            <span className="text-xs text-red-500 mt-1">{errors.username}</span>
          )}
        </div>

        <div>
          <InputGroup>
            <InputGroupInput
              type="email"
              name="email"
              placeholder="Email"
              value={payload.email}
              onChange={handlePayload}
            />
          </InputGroup>
          {errors.email && (
            <span className="text-xs text-red-500 mt-1">{errors.email}</span>
          )}
        </div>

        <div>
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
          </InputGroup>
          {errors.password && (
            <span className="text-xs text-red-500 mt-1">{errors.password}</span>
          )}
        </div>

        <div>
          <InputGroup>
            <InputGroupInput
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={payload.confirmPassword}
              onChange={handlePayload}
            />
          </InputGroup>
          {errors.confirmPassword && (
            <span className="text-xs text-red-500 mt-1">{errors.confirmPassword}</span>
          )}
        </div>

        <Button
          className="w-full bg-blue-700 cursor-pointer"
          type="submit"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Sign Up"}
        </Button>
      </form>

      <div className="flex items-center gap-4 my-3">
        <Separator className="flex-1" />
        <span className="text-sm text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      <Button className="w-full" variant="outline">
        Continue with Google
      </Button>

      <p className="text-sm mt-4">
        Already have an account?{" "}
        <Link to={"/accounts/login"} className="text-[#4150F7] hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
