import express from "express"
import mongoose from "mongoose"
import { verifyAdmin } from "../middleware/auth.js"
import Book from "../models/Book.js"
import BookTransaction from "../models/BookTransaction.js"

const router = express.Router()

router.post("/add-transaction", verifyAdmin, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const newtransaction = await new BookTransaction({
            bookId: req.body.bookId,
            borrowerId: req.body.borrowerId,
            bookName: req.body.bookName,
            borrowerName: req.body.borrowerName,
            transactionType: req.body.transactionType,
            fromDate: req.body.fromDate,
            toDate: req.body.toDate
        })
        const transaction = await newtransaction.save({ session })
        const book = await Book.findById(req.body.bookId).session(session)
        await book.updateOne({ $push: { transactions: transaction._id } }, { session })
        
        await session.commitTransaction();
        session.endSession();
        res.status(200).json(transaction)
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(504).json(err)
    }
})

router.get("/all-transactions", async (req, res) => {
    try {
        const transactions = await BookTransaction.find({}).sort({ _id: -1 })
        res.status(200).json(transactions)
    }
    catch (err) {
        return res.status(504).json(err)
    }
})

router.put("/update-transaction/:id", verifyAdmin, async (req, res) => {
    try {
        await BookTransaction.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        });
        res.status(200).json("Transaction details updated successfully");
    }
    catch (err) {
        res.status(504).json(err)
    }
})

router.delete("/remove-transaction/:id", verifyAdmin, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const data = await BookTransaction.findByIdAndDelete(req.params.id, { session });
        if (data && data.bookId) {
            const book = await Book.findById(data.bookId).session(session);
            await book.updateOne({ $pull: { transactions: req.params.id } }, { session });
        }
        await session.commitTransaction();
        session.endSession();
        res.status(200).json("Transaction deleted successfully");
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return res.status(504).json(err);
    }
})

export default router