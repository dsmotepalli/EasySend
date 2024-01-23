import { atom } from "recoil";

const userAtom = atom({
  key: "userAtom",
  default: {},
});


const balanceAtom = atom({
  key: "balanceAtom",
  default: 0,
});

export {  userAtom, balanceAtom };
