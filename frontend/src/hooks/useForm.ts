import { useState, type ChangeEvent } from "react";

// custom hook for handling form data
export const useForm = <T extends Record<string, unknown>>(initialData: T) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const reset = () => {
    setFormData(initialData);
  };

  return {
    formData,
    handleChange,
    reset,
  };
};
