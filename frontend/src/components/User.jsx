import { Avatar, AvatarFallback } from "./ui/avatar";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { useSetRecoilState } from "recoil";
import { balanceAtom } from "@/store/store";

function User({ user }) {
  const [amount, setAmount] = useState(0);
  const setBalance = useSetRecoilState(balanceAtom);
  const { toast } = useToast();

  async function sendMoney() {
    const { data } = await axios.post(
      "http://localhost:3000/app/v1/account/transfer",
      {
        amount,
        to: user._id,
      },
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );
    if (data.balance) {
      setBalance(Math.floor(data.balance * 100) / 100);
    }

    toast({
      title: "Transfer of funds ",
      description: `${data.message}`,
    });
  }
  
  return (
    <div className="w-full border-2 border-white border-opacity-40 rounded-md  mt-2">
      <div className="flex items-center justify-between p-2">
        <div className=" flex gap-2 items-center">
          <Avatar className="text-center  ">
            <AvatarFallback className="text-black bg-slate-500">
              {user.firstName.slice(0, 1) + user.lastName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <h1>{user.firstName + user.lastName}</h1>
        </div>

        <Dialog>
          <DialogTrigger>
            <Button className="">Send Money</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-inherit">
            <DialogHeader className={"flex justify-center items-center "}>
              <DialogTitle className="font-bold">Send Money</DialogTitle>
            </DialogHeader>
            <div className="flex gap-4 items-center ">
              <Avatar className="text-center  ">
                <AvatarFallback className="text-black bg-slate-500">
                  {user.firstName.slice(0, 1) + user.lastName.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <h1>{user.firstName + " " + user.lastName}</h1>
            </div>
            <div>
              <h1 className="text-lg">Amount in $</h1>
              <Input
                type="number"
                className="bg-inherit"
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit" onClick={() => sendMoney()}>
                  Send
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default User;
