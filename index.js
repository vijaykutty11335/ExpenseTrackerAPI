const express = require('express')
const mongoose = require('mongoose') //for defining a scehema
const bodyParser = require('body-parser')
const cors = require('cors')
const {Expense}  = require('./schema.js')

const app = express()
app.use(bodyParser.json())
app.use(cors())

/**
 * Expense Tracker
 * 
 * Functionalities and end points
 * 
 * adding a new expense - /add-expense : post
 * Expense.create()
 * view existing expenses - /get-expenses : get
 * const data = Expense.find()
 * res.json(data)
 * deleting an expense - /delete-expense : delete
 * Expense.findById()
 * Expense.findAndDeleteById()
 * updating existing ones - /update-expense : patch
 * 
 * notifying when expense exceeds income
 * showing analyzes on monthly trend
 * 
 * creating account
 * validating user
 * 
 * Schema - 
 * categeory, amount, date
 * 
 * things to do before deployment
 * ->script : start(node index.js)
 * ->port: process.env.PORT
 * ->install cors
 */

async function connectToDb(){
    try{
        await mongoose.connect('mongodb+srv://vijays2022it:vijay11335@cluster0.hidupxh.mongodb.net/ExpenseTracker?retryWrites=true&w=majority&appName=Cluster0')
        //process.env.PORT
        const port = process.env.PORT || 8000
        app.listen(port,function(){
        console.log(`Listening on port ${port}...`)
})
    }catch(error){
        console.log(error)
        console.log("Couldn't establish connection :(")
    }

}
connectToDb()


    app.get('/get-expense', async function(request,response){
        try{
            const expenseData = await Expense.find()
            response.status(200).json(expenseData)
        } catch (error){
            response.status(500).json({
                "status" : "failure",
                "message" : "couldn't fetch the details"
            })
        }
    })
    
    app.post('/add-expense', async function(request,response){
        try{
        await Expense.create({
            'amount' : request.body.amount,
            "category" : request.body.category,
            "date" : request.body.date
        })
        response.status(201).json({
            "status" : "sucess",
            "message" : "entry-created"
        })
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "entry not created",
            "error" : error
        })
    }
    })

    app.delete('/delete-expense/:id', async function(request, response) {
        try {
            const expenseEntry = await Expense.findById(request.params.id)
            if(expenseEntry) {
                await Expense.findByIdAndDelete(request.params.id)
                response.status(200).json({
                    "status" : "success",
                    "message" : "successfully deleted the entry"
                })
            } else {
                response.status(404).json({
                    "status" : "failure",
                    "message" : "could not find the entry"
                })
            }
        } catch(error) {
            response.status(500).json({
                "status" : "failure",
                "message" : "could not delete entry",
                "error" : error
            })
        }
    })

    app.patch('/update-expense/:id', async function(request, response) {
        try {
            const expenseEntry = await Expense.findById(request.params.id)
            if(expenseEntry) {
                await expenseEntry.updateOne({
                    "amount" : request.body.amount,
                    "category" : request.body.category,
                    "date" : request.body.date
                })
                response.status(200).json({
                    "status" : "success",
                    "message" : "successfully updated the entry"
                })
            } else {
                response.status(404).json({
                    "status" : "failure",
                    "message" : "could not find the entry"
                })
            }
        } catch(error) {
            response.status(500).json({
                "status" : "failure",
                "message" : "could not update entry",
                "error" : error
            })
        }
    })