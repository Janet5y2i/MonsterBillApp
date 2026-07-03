const {User} = require('../models/User');
const {Group} = require('../models/Group');
const {Record} = require('../models/Record');
const jwt = require('jsonwebtoken');
const {z} = require('zod');

const recordSchema = z.object({
    amount: z.number(),
    category: z.string()
        .refine(value => ['Food', 'Groceries','Transport', 'Shopping', 'Health', 'Bill', 'Accommodation', 'Entertainment', 'Investment','Others']),
    descrition: z.string().optional(),
    date: z.string().optional(),
    type: z.string()
        .refine(value => ['Income', 'Individual Expense', 'Shared Expense']),
    isSettled: z.boolean().optional(),
    userId: z.string().uuid({ message: 'Invalid user ID format' }),
    groupId: z.string().uuid({ message: 'Invalid group ID format' }).optional()

})

const settleRecordSchema = z.object({
    recordId: z.string()
        .uuid({ message: 'Invalid record ID format' }),
    isSettled: z.boolean()
})


//add a new record
exports.addRecord = async (req,res) => {
    try{
        const result = recordSchema.safeParse(req.body);
        if (!result.success){
            return res.status(400).json({message: result.error.errors[0].message});
        }
        const {amount, category, description, date, type, isSettled, userId, groupId} = result.data;
        // Continue with adding the record
        const isUserExist = await User.findOne({where: {id: userId}});
        if (!isUserExist) {
            return res.status(404).json({message: 'User not found'});
        }
        if (groupId) {
            const isGroupExist = await Group.findOne({where: {id: groupId}});
            if (!isGroupExist) {
                return res.status(404).json({message: 'Group not found'});
            }
        }

        await Record.create({amount, category, description, date, type, isSettled, userId, groupId});
        res.status(201).json({message: 'Record added successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}