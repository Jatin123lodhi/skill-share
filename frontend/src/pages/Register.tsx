import { type FormEvent } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import AuthForm from "../components/AuthForm";

const Register = () => {
  const { formData, handleChange} = useForm({
    email: "",
    password: "",
  });

  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {email , password} = formData
    console.log(email, password);
    const response = await register(email, password);
    if (response.success) {
      alert(response.message);
      navigate("/login");
    } else {
      alert(response.error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      <p>Register to SkillShare</p>
      <AuthForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        submitButtonText="Register"
      />

      <button onClick={() => navigate('/login')} className="pt-4 underline cursor-pointer">Login</button>
    </div>
  );
};

export default Register;
