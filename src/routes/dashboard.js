import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import { User, Order, Product } from '../models/index.js';
const router = express.Router();

// This is your new custom dashboard stats api
router.get('/stats', authenticateJWT, async (req, res) => {
    console.log("Dashboard API /stats was called!");
    try {
        const { role } = req.user || {};
        if (role !== 'admin') {
            return res.json({ userCount: 0, orderCount: 0, productCount: 0, revenue: 0 });
        }
        const [userCount, orderCount, productCount, revenue] = await Promise.all([
            User.count(),
            Order.count(),
            Product.count(),
            Order.sum('totalAmount')
        ]);
        res.json({ userCount, orderCount, productCount, revenue: revenue || 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
export default router;