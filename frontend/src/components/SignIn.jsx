import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useActionData, useNavigate } from "react-router-dom";
import axios from "axios";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const FormSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      username: email,
      password,
    };
    console.log(formData);
    const { data } = await axios.post(
      "http://localhost:3000/app/v1/user/signin",
      formData
    );
    if (data) {
      localStorage.setItem("token", `Bearer ${data.token}`);
      navigate("/dashboard");
    }
  };
  return (
    <div className="h-screen w-full flex justify-center items-center text-3xl">
      <div className="w-[400px] h-[300px] border-2 border-blue-50 rounded-md p-2 bg-white text-black">
        <h1 className="text-center font-bold">Sign In</h1>
        <p className="text-xs opacity-60 text-center ">
          Enter Your information to sign in to your account
        </p>
        <form onSubmit={(e) => FormSubmit(e)}>
          <div>
            <label htmlFor="email" className="text-lg">
              Email
            </label>
            <Input
              type="email"
              value={email}
              id="email"
              className="w-full h-8  text-lg "
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
          <div className="flex items-center justify-center mt-4">
            <Button size="sm">Signin</Button>
          </div>
        </form>
        <p className="text-lg text-center mt-4">
          New Here?{" "}
          <a href="" className="underline" onClick={() => navigate("/signup")}>
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
