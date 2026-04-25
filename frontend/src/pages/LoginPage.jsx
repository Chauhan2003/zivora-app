import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { authRoute } from "../utils/routes";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { login } from "../context/userSlice";
import Cookies from "js-cookie";
import { validateLoginPayload } from "../utils/validation";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePayload = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
  };

  // 1️⃣ Get Coordinates
  const getUserLocationCoordinates = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: null, longitude: null });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("⚠️ Location permission denied:", error.message);
          resolve({ latitude: null, longitude: null });
        },
      );
    });
  };

  // 2️⃣ Get Complete Address (Reverse Geocoding via Geoapify)
  const getUserCompleteAddress = async () => {
    const { latitude, longitude } = await getUserLocationCoordinates();

    if (!latitude || !longitude) return null;

    const apiKey = import.meta.env.VITE_GEOCODING_API_KEY;

    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`;

    try {
      const res = await axios.get(url);
      const result = res.data?.features?.[0]?.properties;

      if (!result) return null;

      return {
        latitude,
        longitude,
        city: result.city || result.county || "Unknown",
        state: result.state || "Unknown",
        country: result.country || "Unknown",
      };
    } catch (err) {
      console.error("Error fetching address:", err);
      return null;
    }
  };

  // 3️⃣ Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const validationErrors = validateLoginPayload(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      // Get location and address
      const location = await getUserCompleteAddress();

      // Prepare final payload
      const requestBody = {
        ...payload,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          city: location.city,
          state: location.state,
          country: location.country,
        }, // can be null if user denied
      };

      const res = await axios.post(`${authRoute}/login`, requestBody);

      if (res?.status === 200) {
        const userData = res?.data?.data;
        const accessToken = res?.data?.accessToken;

        // Save in Redux + cookies
        dispatch(login(userData));
        Cookies.set("zivora_access_token", accessToken, {
          expires: 1,
          secure: true,
          sameSite: "Strict",
        });

        toast.success(res?.data?.message);
        navigate("/");
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
    <div className="w-xs">
      <h1 className="font-bold text-xl mb-4">Log In</h1>

      <form className="flex flex-col gap-3" onSubmit={handleLogin}>
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
              name="usernameOrEmail"
              placeholder="Email / Username"
              value={payload.usernameOrEmail}
              onChange={handlePayload}
            />
          </InputGroup>
          {errors.usernameOrEmail && (
            <span className="text-xs text-red-500 mt-1">{errors.usernameOrEmail}</span>
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

        <Link
          to={"/accounts/forget/password"}
          className="text-sm hover:underline"
        >
          Forget Password?
        </Link>

        <Button
          className="w-full bg-blue-700 cursor-pointer"
          type="submit"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Login"}
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
        Don't have an account?{" "}
        <Link to={"/accounts/signup"} className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
