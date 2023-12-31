const Razorpay = require('razorpay');
const Order = require('../model/order')
const userController = require('./user')

const purchasepremium = async (req, res) => {
    try {
        
        var rzp = new Razorpay({
             key_id: process.env.RAZORPAY_KEY_ID,
            //key_id : 'rzp_test_Z8iqODtZ9HuJ7P',
            key_secret: process.env.RAZORPAY_KEY_SECRET
            //key_secret : 'vfci5plMX3wQIYXjz0iu1Wv2'
        })
        // console.log(process.env.RAZORPAY_KEY_ID);
        const amount = 2500;

        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({ order, key_id : rzp.key_id});

            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err})
    }
}

 const updateTransactionStatus = async (req, res ) => {
    try {
        const userId = req.user.id;
        const { payment_id, order_id} = req.body;
        const order  = await Order.findOne({where : {orderid : order_id}}) //2
        const promise1 =  order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}) 
        const promise2 =  req.user.update({ ispremiumuser: true }) 

        Promise.all([promise1, promise2]).then(()=> {
            return res.status(202).json({sucess: true, message: "Transaction Successful", token: userController.generateAccessToken(userId, undefined , true) });
        }).catch((error ) => {
            throw new Error(error)
        })       
    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Sometghing went wrong' })
    }
}

// const updateTransactionStatus = async (req, res) => {
//     try {
//       const { payment_id, order_id } = req.body;
//       const order = await Order.findOne({ where: { orderid: order_id } });
//       if (order) {
//         await order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
//         return res.status(202).json({ success: true, message: 'Transaction Successful' });
//       } else {
//         throw new Error('Order not found');
//       }
//     } catch (err) {
//       console.error(err);
//       res.status(403).json({ error: err.message, message: 'Something went wrong' });
//     }
//   };
  



// const updateTransactionStatus = (req, res ) => {
//     try {
//         const { payment_id, order_id} = req.body;

//         Order.findOne({where : {orderid : order_id}}).then(order => {
//             order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}).then(() => {
//                 return res.status(202).json({sucess: true, message: "Transaction Successful"});
//             }).catch((err)=> {
//                 throw new Error(err);
//             })
//         }).catch(err => {
//             throw new Error(err);
//         })
//     } catch (err) {
//         console.log(err);
//         res.status(403).json({ errpr: err, message: 'Sometghing went wrong' })
//     }
// }


module.exports = {
    purchasepremium,
    updateTransactionStatus
}