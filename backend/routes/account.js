const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account, User } = require("../db");
const { default: mongoose } = require("mongoose");
const zod = require("zod");
const router = express.Router();
const transferBody = zod.object({
  amount: zod.number(),
  to: zod.string(),
});
router.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({ userId: req.userId });
  return res.json({ balance: account.balance });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  console.log(req.body)
  const { success } = transferBody.safeParse(req.body);
  if (!success) {
    return res.json({ message: "Check your inputs" });
  }
  const { amount, to } = req.body;
  const session = await mongoose.startSession();

  session.startTransaction();
  //check the from account
  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );
  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.json({ message: "Insufficient funds" });
  }

  //check to account
  const toAccount = await Account.findOne({ userId: to }).session(session);
  if (!toAccount) {
    await session.abortTransaction();
    return res.json({ message: "Invalid account" });
  }
  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);
  await Account.updateOne(
    { userId: to },
    { $inc: { balance: amount } }
  ).session(session);

  await session.commitTransaction();

 const myAccount = await Account.findOne({ userId: req.userId });
  res.json({
    message: "Your transaction is successful",
     balance: myAccount.balance 
  });
});

module.exports = router;
