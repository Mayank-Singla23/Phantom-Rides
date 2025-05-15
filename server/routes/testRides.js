import express from 'express';
import TestRide from '../schemas/testRide.js';
import User from '../schemas/user.js';
import Car from '../schemas/cars.js';

const router = express.Router();

// Middleware to verify admin status
const verifyAdmin = async (req, res, next) => {
    try {
        const userId = req.headers.userid;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(userId);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Access denied: Admin privileges required' });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// User endpoint to request a test ride
router.post('/request', async (req, res) => {
    try {
        const { userId, carId, preferredDate, preferredTime, notes } = req.body;
        
        // Validate inputs
        if (!userId || !carId || !preferredDate || !preferredTime) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Check if user and car exist
        const user = await User.findById(userId);
        const car = await Car.findById(carId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        
        // Create test ride request
        const testRide = new TestRide({
            userId,
            carId,
            requestDate: new Date(),
            preferredDate: new Date(preferredDate),
            preferredTime,
            notes: notes || ''
        });
        
        await testRide.save();
        
        res.status(201).json(testRide);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User endpoint to get their test ride requests
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const testRides = await TestRide.find({ userId })
            .populate('carId', 'name model year image price')
            .sort({ createdAt: -1 });
            
        res.status(200).json(testRides);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin endpoint to get all test ride requests
router.get('/all', verifyAdmin, async (req, res) => {
    try {
        const testRides = await TestRide.find()
            .populate('userId', 'name email')
            .populate('carId', 'name model year image price')
            .sort({ createdAt: -1 });
            
        res.status(200).json(testRides);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin endpoint to update test ride status
router.put('/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminMessage } = req.body;
        
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        
        const testRide = await TestRide.findByIdAndUpdate(
            id,
            { status, adminMessage: adminMessage || '' },
            { new: true }
        )
            .populate('userId', 'name email')
            .populate('carId', 'name model year image price');
            
        if (!testRide) {
            return res.status(404).json({ message: 'Test ride request not found' });
        }
        
        res.status(200).json(testRide);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
