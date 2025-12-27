import type { FormEvent } from "react";
import { useForm } from "../hooks/useForm";
import AuthForm from "../components/AuthForm";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { formData, handleChange } = useForm({
    email: "",
    password: "",
  });

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    const response = await login(formData.email, formData.password);
    if(response.success){
      alert(`Success: ${response.message}`)
      navigate('/')
    }else{
      alert(`Error: ${response.message}`)
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <p>Login to SkillShare</p>
      <AuthForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        submitButtonText="Login"
      />

      <button className="mt-4 underline cursor-pointer" onClick={() => navigate('/register')}>Register</button>
    </div>
  );
};

export default Login;
