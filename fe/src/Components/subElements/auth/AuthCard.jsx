import React, { useState } from "react";
import { motion } from "framer-motion";
import { GoogleSvg, EmailSvg, PasswordSvg } from "../../../../public/svgs/svg";
import useAuth from "../../../../hooks/auth/useAuth"; 

const InputField = ({ label, type, Icon, name, value, onChange }) => (
  <div className="flex flex-col">
    <label className="text-[#151717] font-semibold">{label}</label>
    <div className="border border-gray-300 rounded-[10px] h-[50px] flex items-center pl-2.5">
      <Icon />
      <input
        name={name} 
        placeholder={`Enter your ${label}`}
        className="ml-2.5 w-full border-none focus:outline-none"
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);


const AuthForm = ({ isSignUp, setIsSignUp, login, signup, loading, error ,name }) => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      await signup(formData.username, formData.email, formData.password);
    } else {
      await login(formData.email, formData.password);
    }
  };

  return (
    <div className="absolute w-full h-full bg-white p-8 rounded-[20px] shadow-md flex flex-col justify-center">
      <h2 className="text-center text-xl font-bold mb-4">{isSignUp ? "Sign Up" : "Login"}</h2>
      
      {error && <p className="text-center text-red-500">{error}</p>} 

      <form onSubmit={handleSubmit}>
      {isSignUp && (
        <InputField
          label="Username"
          type="text"
          Icon={EmailSvg}
          name="username" 
         value={formData.username}
          onChange={handleChange}
       />
      )}
        <InputField
          label="Email"
          type="text"
          Icon={EmailSvg}
          name="email" 
          value={formData.email}
          onChange={handleChange}
        />
        <InputField
         label="Password"
         type="password"
         Icon={PasswordSvg}
         name="password" 
         value={formData.password}
          onChange={handleChange}
        />

        
        <button
          type="submit"
          className="mt-5 bg-[#151717] text-white text-sm font-medium rounded-[10px] h-[50px] w-full cursor-pointer"
          disabled={loading}
        >
          {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <p className="text-center text-black text-sm my-1.5">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}
        <span className="text-[#2d79f3] font-medium cursor-pointer" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? " Login" : " Sign Up"}
        </span>
      </p>

      <p className="text-center text-black text-sm my-1.5">Or With</p>
      <button className="mt-2.5 w-full h-[50px] rounded-[10px] flex justify-center items-center border border-gray-300 bg-white hover:border-[#2d79f3]">
        <GoogleSvg /> Google
      </button>
    </div>
  );
};

const AuthCard = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, signup, loading, error } = useAuth(); 

  return (
    <div className="flex justify-center mt-10">
      <div className="relative w-[450px] h-[500px] perspective-1000">
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: isSignUp ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute w-full h-full" style={{ backfaceVisibility: "hidden" }}>
            <AuthForm isSignUp={false} setIsSignUp={setIsSignUp} login={login} signup={signup} loading={loading} error={error} />
          </div>

          <div className="absolute w-full h-full" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <AuthForm isSignUp={true} setIsSignUp={setIsSignUp} login={login} signup={signup} loading={loading} error={error} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthCard;
