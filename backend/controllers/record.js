const { User, Group, Record, SplitRecord, sequelize } = require('../models');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const splitRecordSchema = z.object({
    userId: z.string().uuid({ message: 'Invalid user ID format' }),
    amount: z.number({ message: 'Amount must be a number' }),
});

const recordSchema = z.object({
    amount: z.number(),
    category: z.string()
        .refine(value => ['Food', 'Groceries', 'Transport', 'Shopping', 'Health', 'Bill', 'Accommodation', 'Entertainment', 'Investment', 'Others'].includes(value)),
    description: z.string().optional(),
    date: z.string().optional(),
    type: z.string()
        .refine(value => ['Income', 'Individual Expense', 'Shared Expense'].includes(value)), // 確保與資料庫 ENUM 拼字完全對齊
    isSettled: z.boolean().optional(),
    payerId: z.string().uuid({ message: 'Invalid payer ID format' }), // 改為必填，因為後續邏輯必須有付款人
    groupId: z.string().uuid({ message: 'Invalid group ID format' }).optional(),
    splits: z.array(splitRecordSchema).optional()
});

// add a new record
exports.addRecord = async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        const result = recordSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: result.error.errors[0].message });
        }
        const { amount, category, description, date, type, isSettled, payerId, groupId, splits } = result.data;
        
        // validate current user
        const currentUserId = req.user ? req.user.id : null;
        if (!currentUserId) {
            await t.rollback();
            return res.status(401).json({ message: 'User not authorized' });
        }

        const creator = await User.findByPk(currentUserId);
        if (!creator) {
            await t.rollback();
            return res.status(404).json({ message: 'Creator not found' });
        }

        // validate payer
        const payer = await User.findByPk(payerId);
        if (!payer) {
            await t.rollback();
            return res.status(404).json({ message: 'Payer not found' });
        }

        // shared expense reocrd
        if (type === 'Shared Expense') {
            if (!groupId) {
                await t.rollback();
                return res.status(400).json({ message: 'Group ID is required' });
            }
            const group = await Group.findByPk(groupId, {
                include: [{ model: User, through: 'UserGroups' }]
            });

            if (!group) {
                await t.rollback();
                return res.status(404).json({ message: 'Group not found' });
            }

            // geet all group members' IDs
            const groupMembers = group.Users.map(user => user.id);

            if (!groupMembers.includes(creator.id)) {
                await t.rollback();
                return res.status(400).json({ message: 'Creator is not in the group.' });
            }

            if (!groupMembers.includes(payer.id)) {
                await t.rollback();
                return res.status(400).json({ message: 'Payer is not in the group.' });
            }

            if (!splits || splits.length === 0) {
                await t.rollback();
                return res.status(400).json({ message: 'Splits are required for shared records' });
            }

            const totalSplitAmount = splits.reduce((sum, split) => sum + split.amount, 0);
            if (Math.abs(totalSplitAmount - amount) > 0.05) {
                await t.rollback();
                return res.status(400).json({ message: 'Total split amount does not match the record amount' });
            }

            for (const split of splits) {
                if (!groupMembers.includes(split.userId)) {
                    await t.rollback();
                    return res.status(400).json({ message: `User with ID ${split.userId} is not in the group.` });
                }
            }

            const newRecord = await Record.create({
                amount,
                category,
                description,
                date,
                type,
                isSettled: isSettled || false,
                payerId,
                creatorId: creator.id,
                groupId
            }, { transaction: t });
        
            const splitRecordsData = splits.map(split => ({
                recordId: newRecord.id,
                userId: split.userId,
                amount: split.amount
            }));

            await SplitRecord.bulkCreate(splitRecordsData, { transaction: t });
        } else {
            // add individual record
            await Record.create({
                amount,
                category,
                description,
                date,
                type,
                isSettled: isSettled || false,
                payerId, 
                creatorId: creator.id 
            }, { transaction: t });
        }

        // commit transaction
        await t.commit();
        return res.status(201).json({ message: 'Record added successfully' });
    } catch (error) {
        // error handler
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};