import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router()

/* Getting user by id */
router.get("/getuser/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("activeTransactions").populate("prevTransactions")
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } 
    catch (err) {
        return res.status(500).json(err);
    }
})

/* Getting all members in the library */
router.get("/allmembers", verifyAdmin, async (req,res)=>{
    try{
        const users = await User.find({}).populate("activeTransactions").populate("prevTransactions").sort({_id:-1})
        const sanitizedUsers = users.map(user => {
            const { password, updatedAt, ...other } = user._doc;
            return other;
        });
        res.status(200).json(sanitizedUsers)
    }
    catch(err){
        return res.status(500).json(err);
    }
})

/* Update user by id */
router.put("/updateuser/:id", verifyToken, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has been updated");
        } catch (err) {
            return res.status(500).json(err);
        }
    }
    else {
        return res.status(403).json("You can update only your account!");
    }
})

/* Adding transaction to active transactions list */
router.put("/:id/move-to-activetransactions", verifyAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        await user.updateOne({ $push: { activeTransactions: req.params.id } })
        res.status(200).json("Added to Active Transaction")
    }
    catch (err) {
        res.status(500).json(err)
    }
})

/* Adding transaction to previous transactions list and removing from active transactions list */
router.put("/:id/move-to-prevtransactions", verifyAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        await user.updateOne({ $pull: { activeTransactions: req.params.id } })
        await user.updateOne({ $push: { prevTransactions: req.params.id } })
        res.status(200).json("Added to Prev transaction Transaction")
    }
    catch (err) {
        res.status(500).json(err)
    }
})

/* Delete user by id */
router.delete("/deleteuser/:id", verifyToken, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can delete only your account!");
    }
})

export default router