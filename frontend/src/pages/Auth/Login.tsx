import { useContext, useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { AxiosError } from "axios";
import { UserContext } from "../../context/userContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  // Handle Login Form Submit
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Пожалуйста, введите действительный адрес электронной почты.");
      return;
    }

    if (!password) {
      setError("Пожалуйста, введите пароль.");
      return;
    }

    setError("");
    setIsLoading(true);

    // Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        // Redirect based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response && error.response.data.message) {
        setError(error.response.data.message || "Login failed");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          С возвращением
        </h3>
        <p className="text-xs text-slate-700 dark:text-slate-300 mt-[5px] mb-6">
          Пожалуйста, введите свои данные для входа в систему
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
              setError(null);
            }}
            label="Почта"
            placeholder="john@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
              setError(null);
            }}
            label="Пароль"
            placeholder="Минимум 8 символов"
            type="password"
          />

          {typeof error === "string" && (
            <p className="text-red-500 text-xs pb-2.5">{error}</p>
          )}

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Загрузка..." : "Войти"}
          </button>

          <p className="text-[13px] text-slate-800 dark:text-slate-400 mt-3">
            У вас нет аккаунта?{" "}
            <Link
              className="font-medium text-primary dark:text-blue-400 underline"
              to="/signup"
            >
              Зарегистрироваться
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;
