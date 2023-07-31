const path = require('path');

const express = require('express');
var cors = require('cors')
const sequelize = require('./util/database');

const User = require('./model/user');
const Expense = require('./model/expenses');

const expenseRoutes = require('./routes/expense');
const userRoutes = require('./routes/user')

const app = express();
app.use(cors());

// app.use(bodyParser.urlencoded());  ////this is for handling forms
app.use(express.json());  //this is for handling jsons


app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize.sync()
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })