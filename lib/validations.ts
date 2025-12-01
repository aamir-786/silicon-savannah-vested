import { z } from 'zod'

// KYC Validation
export const kycSchema = z.object({
    legalName: z.string().min(2, 'Legal name must be at least 2 characters'),
    dateOfBirth: z.string().refine((date) => {
        const age = new Date().getFullYear() - new Date(date).getFullYear()
        return age >= 18
    }, 'You must be at least 18 years old'),
    ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, 'SSN must be in format XXX-XX-XXXX'),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().length(2, 'State must be 2 characters (e.g., NY)'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
    phone: z.string().regex(/^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/, 'Invalid phone number'),
})

export type KYCFormData = z.infer<typeof kycSchema>

// Property Validation
export const propertySchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(50, 'Description must be at least 50 characters'),
    shortDescription: z.string().min(20, 'Short description must be at least 20 characters').max(200),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    country: z.string().default('Kenya'),
    zipCode: z.string().min(4, 'ZIP code is required'),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    totalValue: z.number().positive('Total value must be positive'),
    sharePrice: z.number().positive('Share price must be positive'),
    totalShares: z.number().int().positive('Total shares must be a positive integer'),
    minimumInvestment: z.number().positive('Minimum investment must be positive'),
    expectedAnnualReturn: z.number().min(0).max(100, 'Return must be between 0 and 100%'),
    projectedROI: z.number().min(0),
    propertyType: z.string().min(1, 'Property type is required'),
    squareFeet: z.number().int().positive().optional(),
    bedrooms: z.number().int().positive().optional(),
    bathrooms: z.number().int().positive().optional(),
    yearBuilt: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
})

export type PropertyFormData = z.infer<typeof propertySchema>

// Investment Validation
export const investmentSchema = z.object({
    propertyId: z.string().cuid(),
    shares: z.number().int().positive('Number of shares must be positive'),
    amount: z.number().positive('Investment amount must be positive'),
    bankAccountId: z.string().optional(),
})

export type InvestmentFormData = z.infer<typeof investmentSchema>

// Bank Account Validation
export const bankAccountSchema = z.object({
    plaidPublicToken: z.string().min(1, 'Plaid token is required'),
    accountId: z.string().min(1, 'Account ID is required'),
})

export type BankAccountFormData = z.infer<typeof bankAccountSchema>

// Withdrawal Validation
export const withdrawalSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    bankAccountId: z.string().cuid('Invalid bank account'),
})

export type WithdrawalFormData = z.infer<typeof withdrawalSchema>

// Dividend Distribution Validation
export const dividendDistributionSchema = z.object({
    propertyId: z.string().cuid(),
    totalAmount: z.number().positive('Total amount must be positive'),
    quarter: z.string().regex(/^Q[1-4] \d{4}$/, 'Quarter must be in format "Q1 2024"'),
    year: z.number().int().min(2020).max(2100),
})

export type DividendDistributionFormData = z.infer<typeof dividendDistributionSchema>

// Contact Form Validation
export const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(5, 'Subject must be at least 5 characters'),
    message: z.string().min(20, 'Message must be at least 20 characters'),
})

export type ContactFormData = z.infer<typeof contactSchema>

// User Profile Update Validation
export const profileUpdateSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
})

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>

// Search and Filter Validation
export const propertyFilterSchema = z.object({
    search: z.string().optional(),
    city: z.string().optional(),
    propertyType: z.string().optional(),
    minPrice: z.number().positive().optional(),
    maxPrice: z.number().positive().optional(),
    minReturn: z.number().min(0).max(100).optional(),
    maxReturn: z.number().min(0).max(100).optional(),
    status: z.enum(['DRAFT', 'ACTIVE', 'FUNDING', 'FUNDED', 'CLOSED']).optional(),
})

export type PropertyFilterData = z.infer<typeof propertyFilterSchema>

// Transaction Filter Validation
export const transactionFilterSchema = z.object({
    type: z.enum(['INVESTMENT', 'DIVIDEND', 'WITHDRAWAL', 'REFUND']).optional(),
    status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
})

export type TransactionFilterData = z.infer<typeof transactionFilterSchema>

// Admin KYC Review Validation
export const kycReviewSchema = z.object({
    userId: z.string().cuid(),
    status: z.enum(['APPROVED', 'REJECTED']),
    rejectionReason: z.string().optional(),
})

export type KYCReviewFormData = z.infer<typeof kycReviewSchema>

// Pagination Validation
export const paginationSchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
})

export type PaginationData = z.infer<typeof paginationSchema>
