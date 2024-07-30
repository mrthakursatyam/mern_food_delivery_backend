import express from 'express'
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder } from '../controllers/orderController.js'
import authMiddleware from '../middleware/auth.js'

const orderRouter = express.Router()

orderRouter.post('/place', authMiddleware, placeOrder)
orderRouter.post('/verify', verifyOrder)
orderRouter.get('/userOrders', authMiddleware, userOrders)
orderRouter.get('/listOrders', listOrders)
orderRouter.post('/status', updateStatus)

export default orderRouter