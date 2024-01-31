import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import React, { useEffect, useState } from "react";
import User from "./User";
import { Toaster } from "./ui/toaster";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { balanceAtom, userAtom } from "../store/store";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Avatar, AvatarFallback } from "./ui/avatar";

function Dashboard() {
  const [balance, setBalance] = useRecoilState(balanceAtom);
  const [users, setUsers] = useState(null);
  const [filter, setFilter] = useState(null);
  const [currentuser, setCurrentUser] = useRecoilState(userAtom);

  useEffect(() => {
    getBalance();
    getCurrentUser();
  }, []);

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
  async function getCurrentUser() {
    const { data } = await axios.get(
      "http://localhost:3000/app/v1/user/currentuser",
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );
    console.log(data);
    setCurrentUser(data);
  }

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
        <div className="h-10 w-full pb-1 flex items-center justify-between border-b-white border-b-2">
          <h1 className="font-bold">Payments App</h1>
          <h3>
            {currentuser.firstName ? (
              <Dialog>
                <DialogTrigger className="border-2 rounded-lg p-2">
                  {currentuser.firstName}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-inherit">
                  <DialogHeader className={"flex justify-center items-center "}>
                    <DialogTitle className="font-bold">
                      User Details
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex gap-4 items-center flex-col ">
                    <Avatar className="text-center  ">
                      <AvatarFallback className="text-black bg-slate-500">
                        {currentuser.firstName.slice(0, 1) +
                          currentuser.lastName.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <h1>
                      {currentuser.firstName + " " + currentuser.lastName}
                    </h1>
                    <h1>{currentuser.username}</h1>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              "user"
            )}
          </h3>
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
              placeholder="Search Users for example.. name, john"
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
