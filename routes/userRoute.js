import express  from 'express'
import { createUser, signInUser,getAllUsers } from '../controllers/userControler.js'
import { upload } from '../middlewares/upload.js' 
import { validate } from '../middlewares/validateZod.js'
import { createUserSchema } from '../schema/userValidateSchema.js'
import { protect } from '../middlewares/authenticate.js'
import { authorize } from '../middlewares/authorize.js'
import { createTransaction, deleteTransection, getMonthlySummary, getTransactions, updateTransection } from '../controllers/transectionControler.js'
const  router = express.Router()

// All Routes Here

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post('/register', upload.single('profilePicture'), validate(createUserSchema),createUser)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login',signInUser);


/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get current logged-in user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user profile info
 *       401:
 *         description: Unauthorized
 */
router.get('/profile',protect, (req,res)=>{
     console.log('show me user info :', req.user);
  res.json(req.user) 
})


/**
 * @swagger
 * /auth/admin:
 *   get:
 *     summary: Admin-only route to verify role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted
 *       403:
 *         description: Forbidden - not an admin
 *       401:
 *         description: Unauthorized
 */

router.get('/admin', protect,authorize('admin'))

/**
 * @swagger
 * /auth/transection:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, amount, categoryType, category, date]
 *             properties:
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               categoryType:
 *                 type: string
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Transaction created
 *       400:
 *         description: Validation error
 */

router.post('/transection', protect, createTransaction)

/**
 * @swagger
 * /auth/transections:
 *   get:
 *     summary: Get all transactions of the current user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of transactions
 *       401:
 *         description: Unauthorized
 */

router.get('/transections', protect, getTransactions)

/**
 * @swagger
 * /auth/transections/monthly-summary:
 *   get:
 *     summary: Get monthly transaction summary
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a summary of income/expenses by month
 *       401:
 *         description: Unauthorized
 */

router.get('/transections/monthly-summary', protect, getMonthlySummary)  

/**
 * @swagger
 * /auth/transections/{id}:
 *   put:
 *     summary: Update a transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               categoryType:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction updated
 *       404:
 *         description: Transaction not found
 */

router.put('/transections/:id', protect, updateTransection)

/**
 * @swagger
 * /auth/transections/{id}:
 *   delete:
 *     summary: Delete a transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction deleted
 *       404:
 *         description: Transaction not found
 */

router.delete('/transections/:id', protect, deleteTransection)

/**
 * @swagger
 * /auth/admin-overview:
 *   get:
 *     summary: Get admin dashboard overview (only for admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user count, top categories, etc.
 *       403:
 *         description: Forbidden - not an admin
 */

router.get('/admin-overview', protect, getAllUsers)

export default router