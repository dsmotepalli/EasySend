import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const FormSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      username: email,
      password,
      firstName,
      lastName,
    };
    console.log(formData);
    const { data } = await axios.post(
      "http://localhost:3000/app/v1/user/signup",
      formData
    );
    if (data) {
      localStorage.setItem("token", `Bearer ${data.token}`);
      navigate("/dashboard");
    }
  };
  return (
    <div className="h-screen w-full flex justify-center items-center ">
      <div className="w-[400px] h-[420px] text-3xl border-2 border-blue-50 rounded-md p-2 bg-white text-black">
        <h1 className="text-center font-bold">Sign Up</h1>
        <p className="text-xs opacity-60 text-center ">
          Enter Your information to Create an account
        </p>
        <form onSubmit={(e) => FormSubmit(e)}>
          <div>
            <label htmlFor="firstname" className="text-lg">
              First Name
            </label>
            <Input
              type=""
              required={"required"}
              value={firstName}
              id="firstname"
              className="w-full h-8  text-lg"
              onChange={(e) => setFirstName(e.target.value)}
            ></Input>
          </div>
          <div>
            <label htmlFor="lastanem" className="text-lg">
              Last Name
            </label>
            <Input
              type=""
              required={"required"}
              id="lastanem"
              className="w-full h-8 text-lg"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            ></Input>
          </div>
          <div>
            <label htmlFor="email" className="text-lg">
              Email
            </label>
            <Input
              type="email"
              value={email}
              id="email"
              className="w-full h-8  text-lg"
              required={"required"}
              onChange={(e) => setEmail(e.target.value)}
            ></Input>
          </div>
          <div>
            <label htmlFor="password" className="text-lg">
              Password
            </label>
            <Input
              type="Password"
              required={"required"}
              value={password}
              id="password"
              className="w-full h-8 text-lg"
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
          </div>
          <div className="flex items-center justify-center pt-2">
            <Button size="sm">Signup</Button>
          </div>
        </form>
        <p className="text-lg text-center">
          {" "}
          Already have an account?{" "}
          <a href="" className="underline" onClick={() => navigate("/signin")}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
