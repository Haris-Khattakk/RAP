import { useState, useEffect } from "react";
import { Building, Mail, Lock, Upload, User } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import getValidationSchema from "../AuthenticationSchema/ValidationSchema";
import { useMutation } from "@tanstack/react-query";
import { APIS } from "../../config/Config";
// import getRandomName from "../functions/getRandomName";

const AuthForm = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState(mode || "signin");

  useEffect(() => {
    setAuthMode(mode === "signup" ? "signup" : "signin");
  }, [mode]);
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const {
    mutate,
    data: user,
    loading,
    error,
  } = useMutation({
    mutationFn: async (formValues) => {
      return mode === "signup"
        ? await APIS.signup(formValues)
        : await APIS.signin(formValues);
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSubmit = (values) => {
    if (authMode === "signup" && values.password !== values.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // alert(authMode === "signin" ? "Signed In" : "Account Created");
    if (authMode === "signup") {
      const formData = new FormData();
      formData.append("email",values.email);
      formData.append("password",values.password);
      formData.append("name", values.userName);
      formData.append("role", "User");
      if (imageFile) {
        formData.append("image", imageFile);
      }
      mutate(formData);
    } else {
      const data = {
        email: values.email,
        password: values.password
      }
      mutate(data)
    }
  };

  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: getValidationSchema(authMode),
    enableReinitialize: true,
    onSubmit: (values) => handleSubmit(values),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#121212] to-black text-white px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center items-center gap-2">
            <Building className="h-6 w-6 text-white" />
            <h1 className="text-2xl font-bold">RateAProperty</h1>
          </div>
          <p className="text-gray-400 text-sm">
            Join our community of property reviewers
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-xl">
          {/* Tabs */}
          <div className="flex bg-gray-700 p-1 rounded">
            <button
              onClick={() => navigate("/authentication/signin")}
              className={`w-1/2 py-2 text-sm font-medium rounded ${
                authMode === "signin"
                  ? "bg-gray-300 text-black"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/authentication/signup")}
              className={`w-1/2 py-2 text-sm font-medium rounded ${
                authMode === "signup"
                  ? "bg-gray-300 text-black"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-bold">
              {authMode === "signin" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-gray-400">
              {authMode === "signin"
                ? "Sign in to your account to continue"
                : "Join our community of property reviewers"}
            </p>

            {/* Profile Image (Signup) */}
            {authMode === "signup" && (
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="w-20 h-20 border-2 border-white rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full  h-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 bg-white  text-black p-1 rounded-full cursor-pointer hover:bg-gray-200">
                    <Upload className="h-3  w-3" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-400">Upload profile picture</p>
              </div>
            )}
            {authMode === "signup" && (
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="userName"
                  placeholder="Enter user name"
                  className="pl-10 w-full py-2 rounded bg-gray-700 text-white border border-gray-600 placeholder-gray-400 text-sm"
                  value={formik.values.userName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.userName && formik.errors.userName && (
                  <p className="text-xs text-red-500 mt-1">
                    {formik.errors.userName}
                  </p>
                )}
              </div>
            )}
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="pl-10 w-full py-2 rounded bg-gray-700 text-white border border-gray-600 placeholder-gray-400 text-sm"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="pl-10 w-full py-2 rounded bg-gray-700 text-white border border-gray-600 placeholder-gray-400 text-sm"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {/* Confirm Password (Signup) */}
            {authMode === "signup" && (
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  className="pl-10 w-full py-2 rounded bg-gray-700 text-white border border-gray-600 placeholder-gray-400 text-sm"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              onClick={formik.handleSubmit}
              className="w-full bg-white text-black py-2 rounded hover:bg-gray-200 transition"
            >
              {authMode === "signin" ? "Sign In" : "Sign Up"}
            </button>

            {/* Hint */}
            {authMode === "signup" && (
              <p className="text-xs text-center text-gray-400">
                Demo mode: You can use any email and password
              </p>
            )}
          </div>
        </div>

        {/* Back */}
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white text-sm"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
