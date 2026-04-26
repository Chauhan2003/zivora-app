import { Route, Routes } from "react-router-dom";
import AuthLayout from "./pages/layouts/AuthLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MainLayout from "./pages/layouts/MainLayout";
import FeedPage from "./pages/FeedPage";
import SearchPage from "./pages/SearchPage";
import useCurrentUser from "./hooks/useCurrentUser";
import Protect from "./utils/protect";
import PublicRoute from "./utils/publicRoute";
import ProfilePage from "./pages/ProfilePage";
import { SocketProvider } from "./context/socket";
import CheckInboxPage from "./pages/CheckInboxPage";
import NotificationPage from "./pages/NotificationPage";
import SettingsEditProfilePage from "./pages/SettingsEditProfilePage";
import SettingsAccountPrivacyPage from "./pages/SettingsAccountPrivacyPage";
import MessagePage from "./pages/MessagePage";
import { ThemeProvider } from "./context/themeContext.jsx";

const App = () => {
  useCurrentUser();

  return (
    <ThemeProvider>
      <SocketProvider>
        <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/accounts" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<RegisterPage />} />
          </Route>
          <Route
            path="/accounts/forget/password"
            element={<ForgetPasswordPage />}
          />
          <Route
            path="/accounts/reset/password/:token"
            element={<ResetPasswordPage />}
          />
          <Route
            path="/accounts/verify/email/:token"
            element={<VerifyEmailPage />}
          />
          <Route path="/accounts/check/inbox" element={<CheckInboxPage />} />
        </Route>

        <Route element={<Protect />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<FeedPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="profile/:username" element={<ProfilePage />} />
            <Route path="message" element={<MessagePage />} />
            <Route path="messages" element={<MessagePage />} />
            <Route path="notifications" element={<NotificationPage />} />
            <Route path="settings/edit" element={<SettingsEditProfilePage />} />
            <Route path="settings/privacy" element={<SettingsAccountPrivacyPage />} />
          </Route>
        </Route>
      </Routes>
    </SocketProvider>
    </ThemeProvider>
  );
};

export default App;
