import z from 'zod'

export const createUserSchema = z.object ({
    name : z.string().min(1, 'Name is required'),
    email : z.string().email('Email must be valid'),
    password : z.string().min(6," password must be 6 characters"). max(20,'password must be at most 20 characters')
})