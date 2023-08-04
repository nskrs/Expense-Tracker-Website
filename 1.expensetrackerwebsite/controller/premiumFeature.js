const User = require('../model/users');
const Expense = require('../model/expenses');
const sequelize = require('../util/database');
const e = require('express');

const getUserLeaderBoard = async (req, res) => {
    try{
        const leaderboardofusers = await User.findAll({
            // attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'total_cost'] ],
            // include: [
            //     {
            //         model: Expense,
            //         attributes: []
            //     }
            // ],
            // group:['user.id'],
            // order:[['total_cost', 'DESC']]

            order:[['totalExpenses', 'DESC']]
        })
       
        res.status(200).json(leaderboardofusers)
    
    } catch (err){
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    getUserLeaderBoard
}
