






import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Loginpage.css";
import schoolLogo from "../assets/Online school logo.png";
import whatsappIcon from "../assets/watsapp icon.png";

const OTP_LEN = 6;
const TEACHING_TEAM_WHATSAPP_LINK = "https://wa.me/+919847561998?text=onlineschoolteachingdetails";

function normalizeRole(role) {
  return String(role || "").toLowerCase().trim();
}

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// function routeByRole(role) {
//   const r = normalizeRole(role);
//   if (r === "admin") return "/admin";
//   return "/student";
// }


function routeByRole(role) {
  const r = normalizeRole(role);

  if (r === "admin") return "/admin";
  if (r === "tutor") return "/tutor";

  return "/student";
}


function OtpInputs({ value, onChange }) {
  const digits = useMemo(
    () => Array.from({ length: OTP_LEN }, (_, i) => value[i] || ""),
    [value]
  );

  const setDigit = (i, d) => {
    const next = value.split("");
    next[i] = d;
    onChange(next.join("").slice(0, OTP_LEN));
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus();
    }
  };

  const handleChange = (e, i) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 1);
    setDigit(i, v);
    if (v && i < OTP_LEN - 1) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    const text = (e.clipboardData.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, OTP_LEN);

    if (!text) return;
    e.preventDefault();
    onChange(text);
    document
      .getElementById(`otp-${Math.min(text.length - 1, OTP_LEN - 1)}`)
      ?.focus();
  };

  return (
    <div className="otp-row" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          className="otp-box"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        />
      ))}
    </div>
  );
}

function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title">{title}</div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loginForm, setLoginForm] = useState({
    input: "",
    pass: "",
  });
  const [loginMsg, setLoginMsg] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [modal, setModal] = useState(null);

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    phone: "",
    pass: "",
    cpass: "",
  });
  const [signupMsg, setSignupMsg] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpMsg, setOtpMsg] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const [resetForm, setResetForm] = useState({
    email: "",
    newpass: "",
    confirmpass: "",
  });
  const [resetMsg, setResetMsg] = useState("");
  const [resetLoading, setResetLoading] = useState(false);







  useEffect(() => {
    async function verifyInviteLogin() {
      try {
        const params = new URLSearchParams(location.search);
        const inviteToken = params.get("token");

        if (!inviteToken) return;

        setLoginMsg("Verifying invite link...");

        const { data } = await api.get(
          `/student/invite/${encodeURIComponent(inviteToken)}`
        );

        const loginData = data?.loginData;

        if (loginData?.email && loginData?.pass) {
          setLoginForm((prev) => ({
            ...prev,
            input: loginData.email,
            pass: loginData.pass,
          }));

          setLoginMsg("Invite verified ✅ Please click Sign In");
        } else {
          setLoginMsg("Invite verified, but login data not received");
        }
      } catch (err) {
        setLoginMsg(
          err?.response?.data?.msg ||
          err?.response?.data?.error ||
          err?.message ||
          "Invalid or expired invite link"
        );
      }
    }

    verifyInviteLogin();
  }, [location.search]);










  const closeAll = () => {
    setModal(null);
    setSignupMsg("");
    setForgotMsg("");
    setOtpMsg("");
    setResetMsg("");
    setOtp("");
    setSignupLoading(false);
    setForgotLoading(false);
    setOtpLoading(false);
    setResetLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMsg("");
    setLoginLoading(true);

    try {
      const cleanInput = loginForm.input.trim();

      const payload = {
        pass: loginForm.pass,
      };

      if (cleanInput.includes("@")) {
        payload.email = cleanInput;
      } else {
        payload.phone = cleanInput;
      }

      const res = await api.post("/login_user", payload);

      const token = res.data?.token;
      const user = res.data?.user || {};
      const apiRole = user?.role || res.data?.role;
      const decoded = token ? decodeJwt(token) : null;
      const tokenRole = decoded?.role;
      const role = normalizeRole(apiRole || tokenRole || "student");

      if (!token) {
        throw new Error("Token not received from backend");
      }

      const finalUser = {
        ...user,
        role,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(finalUser));

      setLoginMsg("Login success ✅");
      navigate(routeByRole(role), { replace: true });
    } catch (err) {
      setLoginMsg(
        err?.response?.data?.msg ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed"
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async () => {
    setSignupMsg("");
    setSignupLoading(true);

    try {
      await api.post("/register", {
        name: signupForm.name,
        email: signupForm.email,
        phone: signupForm.phone,
        pass: signupForm.pass,
        cpass: signupForm.cpass,
      });

      setLoginForm((p) => ({
        ...p,
        input: signupForm.email || signupForm.phone || p.input,
      }));

      setSignupMsg("Registration successful ✅");

      setTimeout(() => {
        closeAll();
      }, 1200);
    } catch (err) {
      setSignupMsg(
        err?.response?.data?.msg ||
        err?.response?.data?.error ||
        err?.message ||
        "Register failed"
      );
    } finally {
      setSignupLoading(false);
    }
  };

  const handleForgotSendOtp = async () => {
    setForgotMsg("");
    setForgotLoading(true);

    try {
      await api.post("/user_forgoat_password_send_otp", {
        email: forgotEmail,
      });

      setOtp("");
      setOtpMsg("OTP sent ✅");
      setModal("forgotOtp");
    } catch (err) {
      setForgotMsg(
        err?.response?.data?.msg ||
        err?.response?.data?.error ||
        err?.message ||
        "Send OTP failed"
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotOtpConfirm = async () => {
    setOtpMsg("");
    setOtpLoading(true);

    try {
      await api.post("/user_forgoat_password_verify_otp", {
        email: forgotEmail,
        otp,
      });

      setResetForm({
        email: forgotEmail,
        newpass: "",
        confirmpass: "",
      });

      setModal("resetPass");
    } catch (err) {
      setOtpMsg(
        err?.response?.data?.msg ||
        err?.response?.data?.error ||
        err?.message ||
        "OTP verify failed"
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResetConfirm = async () => {
    setResetMsg("");
    setResetLoading(true);

    try {
      await api.post("/user_reset_password", {
        email: resetForm.email,
        newpass: resetForm.newpass,
        confirmpass: resetForm.confirmpass,
      });

      const newPass = resetForm.newpass;

      closeAll();

      setLoginForm((p) => ({
        ...p,
        input: resetForm.email || p.input,
        pass: newPass,
      }));

      setLoginMsg("Password reset ✅ Now login");
    } catch (err) {
      setResetMsg(
        err?.response?.data?.msg ||
        err?.response?.data?.error ||
        err?.message ||
        "Reset failed"
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="zs-wrap">
      <div className="zs-shell">
        <div className="zs-left">
          <div className="zs-left-inner">
            <img src={schoolLogo} alt="Online School" className="zs-logo" />

            <ul className="zs-bullets">
              <li>Live & recorded classes</li>
              <li>Expert teachers & mentorship</li>
              <li>Assignments & quizzes</li>
              <li>Progress tracking & reports</li>
              <li>Student-teacher interaction</li>
            </ul>

            <a
              href="https://wa.me/message/XTRJLU7IXTBHI1"
              style={{ color: "#fff", textDecoration: "none", fontWeight: "800" }}
            > <button className="zs-contact-btn" type="button">

                Contact us
              </button></a>
          </div>
        </div>

        <div className="zs-right">
          <div className="zs-card">
            <h2 className="zs-title">Welcome Back</h2>
            <p className="zs-desc">
              Sign in to access the online school management platform
            </p>

            {loginMsg ? <div className="zs-msg">{loginMsg}</div> : null}

            <form className="zs-form" onSubmit={handleLogin}>
              <label className="zs-label">Email or Phone</label>
              <input
                className="zs-input"
                type="text"
                value={loginForm.input}
                onChange={(e) =>
                  setLoginForm((p) => ({ ...p, input: e.target.value }))
                }
                required
              />

              <label className="zs-label">Password</label>
              <input
                className="zs-input"
                type="password"
                value={loginForm.pass}
                onChange={(e) =>
                  setLoginForm((p) => ({ ...p, pass: e.target.value }))
                }
                required
              />

              <div className="zs-row">
                <button
                  type="button"
                  className="zs-link"
                  onClick={() => {
                    const value = loginForm.input.trim();
                    setForgotEmail(value.includes("@") ? value : "");
                    setForgotMsg("");
                    setModal("forgot");
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <button className="zs-btn" disabled={loginLoading}>
                {loginLoading ? "Signing in..." : "Sign In"}
              </button>

              <div className="zs-bottom">
                <span>New user?</span>
                <button
                  type="button"
                  className="zs-link"
                  onClick={() => setModal("signup")}
                >
                  Register
                </button>
              </div>
            </form>
            <a
              className="zs-teaching-team"
              href={TEACHING_TEAM_WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
            >
              <img src={whatsappIcon} alt="WhatsApp" />
              <span>Join our teaching team</span>
            </a>
          </div>



        </div>

      </div>


      <Modal open={modal === "signup"} title="Create Account" onClose={closeAll}>
        {signupMsg ? <div className="zs-msg">{signupMsg}</div> : null}

        <div className="m-form">
          <input
            className="zs-input"
            placeholder="Name"
            value={signupForm.name}
            onChange={(e) =>
              setSignupForm((p) => ({ ...p, name: e.target.value }))
            }
          />

          <input
            className="zs-input"
            type="email"
            placeholder="Email (required)"
            value={signupForm.email}
            onChange={(e) =>
              setSignupForm((p) => ({ ...p, email: e.target.value }))
            }
          />

          <input
            className="zs-input"
            type="text"
            placeholder="Phone (required)"
            value={signupForm.phone}
            onChange={(e) =>
              setSignupForm((p) => ({ ...p, phone: e.target.value }))
            }
          />

          <input
            className="zs-input"
            type="password"
            placeholder="Password"
            value={signupForm.pass}
            onChange={(e) =>
              setSignupForm((p) => ({ ...p, pass: e.target.value }))
            }
          />

          <input
            className="zs-input"
            type="password"
            placeholder="Confirm password"
            value={signupForm.cpass}
            onChange={(e) =>
              setSignupForm((p) => ({ ...p, cpass: e.target.value }))
            }
          />

          <div className="m-actions">
            <button className="zs-btn outline" type="button" onClick={closeAll}>
              Back
            </button>

            <button
              className="zs-btn"
              type="button"
              onClick={handleSignup}
              disabled={
                signupLoading ||
                !signupForm.name ||
                !signupForm.email ||
                !signupForm.phone ||
                !signupForm.pass ||
                !signupForm.cpass ||
                signupForm.pass !== signupForm.cpass
              }
            >
              {signupLoading ? "Registering..." : "Register"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={modal === "forgot"} title="Forgot Password" onClose={closeAll}>
        {forgotMsg ? <div className="zs-msg">{forgotMsg}</div> : null}

        <div className="m-form">
          <label className="zs-label">Email</label>
          <input
            className="zs-input"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />

          <div className="m-actions">
            <button className="zs-btn outline" type="button" onClick={closeAll}>
              Back
            </button>

            <button
              className="zs-btn"
              type="button"
              onClick={handleForgotSendOtp}
              disabled={forgotLoading || !forgotEmail}
            >
              {forgotLoading ? "Sending..." : "Send Otp"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={modal === "forgotOtp"} title="Verify OTP" onClose={closeAll}>
        {otpMsg ? <div className="zs-msg">{otpMsg}</div> : null}

        <div className="m-form">
          <label className="zs-label">Email</label>
          <input className="zs-input" value={forgotEmail} disabled />

          <label className="zs-label">Enter OTP</label>
          <OtpInputs value={otp} onChange={setOtp} />

          <div className="m-actions">
            <button
              className="zs-btn outline"
              type="button"
              onClick={() => setModal("forgot")}
            >
              Back
            </button>

            <button
              className="zs-btn"
              type="button"
              onClick={handleForgotOtpConfirm}
              disabled={otpLoading || otp.length !== 6}
            >
              {otpLoading ? "Confirming..." : "Confirm"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={modal === "resetPass"} title="Reset Password" onClose={closeAll}>
        {resetMsg ? <div className="zs-msg">{resetMsg}</div> : null}

        <div className="m-form">
          <label className="zs-label">Email</label>
          <input className="zs-input" value={resetForm.email} disabled />

          <input
            className="zs-input"
            type="password"
            placeholder="New password"
            value={resetForm.newpass}
            onChange={(e) =>
              setResetForm((p) => ({ ...p, newpass: e.target.value }))
            }
          />

          <input
            className="zs-input"
            type="password"
            placeholder="Confirm new password"
            value={resetForm.confirmpass}
            onChange={(e) =>
              setResetForm((p) => ({ ...p, confirmpass: e.target.value }))
            }
          />

          <div className="m-actions">
            <button className="zs-btn outline" type="button" onClick={closeAll}>
              Back
            </button>

            <button
              className="zs-btn"
              type="button"
              onClick={handleResetConfirm}
              disabled={
                resetLoading ||
                !resetForm.newpass ||
                resetForm.newpass !== resetForm.confirmpass
              }
            >
              {resetLoading ? "Saving..." : "Confirm"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}