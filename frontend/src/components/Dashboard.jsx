import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import React, { useEffect, useState } from "react";
import User from "./User";
import { Toaster } from "./ui/toaster";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { balanceAtom } from "../store/store";

function Dashboard() {
  const [balance, setBalance] = useRecoilState(balanceAtom);
  const [users, setUsers] = useState(null);
  const [filter, setFilter] = useState(null);

  async function getBalance() {
    const { data } = await axios.get(
      "http://localhost:3000/app/v1/account/balance",
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );

    setBalance(Math.floor(data.balance * 100) / 100);
  }
  useEffect(() => {
    getBalance();
  },[]);

  const formSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.get(
      `http://localhost:3000/app/v1/user/bulk?filter=${filter}`,
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );

    setUsers(data.users);
  };
  return (
    <div className="h-screen w-full">
      <div className="m-4">
        <div className="h-10 w-full flex items-center justify-between border-b-white border-b-2">
          <h1 className="font-bold">Payments App</h1>
          <h3>User</h3>
        </div>

        <div className="mt-2">
          <h3 className="font-semibold">Your Balance ${balance}</h3>
        </div>

        <div className="mt-3">
          <h1 className="font-bold">Users</h1>
          <form
            onSubmit={(e) => {
              formSubmit(e);
            }}
            className="flex"
          >
            <Input
              onChange={(e) => setFilter(e.target.value)}
              className="bg-inherit"
              placeholder="Search Users..."
            ></Input>
            <Button>Search</Button>
          </form>

          {users &&
            users.map((user, index) => {
              return <User user={user} key={index} />;
            })}
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Dashboard;
