import * as Yup from "yup";

// Dynamic validation schema
const getValidationSchema = (authMode) => {
  return Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    ...(authMode === "signup" && {
      userName: Yup.string().min(3, "Minimum 3 characters").required("Username is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm your password"),
    }),
  });
};

export default getValidationSchema;