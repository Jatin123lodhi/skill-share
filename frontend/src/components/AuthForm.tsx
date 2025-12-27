import type { ChangeEvent, FormEvent } from "react";

interface IAuthFormProps {
  submitButtonText: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  formData: Record<string, string | number>;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const AuthForm = (props: IAuthFormProps) => {
  const { handleSubmit, formData, handleChange, submitButtonText } = props;
  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4 w-100">
      <input
        name="email"
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
        className="p-2 border border-gray-300"
      />
      <input
        name="password"
        placeholder="Enter password"
        value={formData.password}
        onChange={handleChange}
        className="p-2 border border-gray-300"
        type="password"
      />

      <button
        className="border border-gray-300 p-2 cursor-pointer"
        type="submit"
      >
        {submitButtonText}
      </button>
    </form>
  );
};

export default AuthForm;
