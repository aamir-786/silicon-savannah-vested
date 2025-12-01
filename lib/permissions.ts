import { UserRole, KYCStatus } from '@prisma/client'
import { getSession } from '@auth0/nextjs-auth0'
import prisma from './db'

export async function getCurrentUser() {
    try {
        const session = await getSession()

        if (!session?.user) {
            return null
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
            include: {
                kycData: true,
            },
        })

        return user
    } catch (error) {
        console.error('Error getting current user:', error)
        return null
    }
}

export async function requireAuth() {
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    return user
}

export async function requireRole(allowedRoles: UserRole[]) {
    const user = await requireAuth()

    if (!allowedRoles.includes(user.role)) {
        throw new Error('Forbidden: Insufficient permissions')
    }

    return user
}

export async function requireKYCApproved() {
    const user = await requireAuth()

    if (user.kycStatus !== KYCStatus.APPROVED) {
        throw new Error('KYC approval required')
    }

    return user
}

export function hasRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
    return allowedRoles.includes(userRole)
}

export function isKYCApproved(kycStatus: KYCStatus): boolean {
    return kycStatus === KYCStatus.APPROVED
}

export function canInvest(user: { role: UserRole; kycStatus: KYCStatus }): boolean {
    return user.kycStatus === KYCStatus.APPROVED
}

export function canAccessAdminPanel(userRole: UserRole): boolean {
    return userRole === UserRole.ADMIN
}

export function canManageProperties(userRole: UserRole): boolean {
    return userRole === UserRole.ADMIN
}

export function canManageUsers(userRole: UserRole): boolean {
    return userRole === UserRole.ADMIN
}

export function canDistributeDividends(userRole: UserRole): boolean {
    return userRole === UserRole.ADMIN
}

export function canViewAllInvestments(userRole: UserRole): boolean {
    return userRole === UserRole.ADMIN
}

// Permission checks for specific actions
export const permissions = {
    // Property permissions
    viewProperties: (userRole: UserRole) => true, // All can view
    viewPropertyDetails: (userRole: UserRole) => true,
    createProperty: (userRole: UserRole) => userRole === UserRole.ADMIN,
    updateProperty: (userRole: UserRole) => userRole === UserRole.ADMIN,
    deleteProperty: (userRole: UserRole) => userRole === UserRole.ADMIN,

    // Investment permissions
    makeInvestment: (user: { role: UserRole; kycStatus: KYCStatus }) =>
        user.kycStatus === KYCStatus.APPROVED,
    viewOwnInvestments: (userRole: UserRole) =>
        [UserRole.INVESTOR_VERIFIED, UserRole.INVESTOR_UNVERIFIED, UserRole.ADMIN].includes(userRole),
    viewAllInvestments: (userRole: UserRole) => userRole === UserRole.ADMIN,

    // KYC permissions
    submitKYC: (userRole: UserRole) =>
        [UserRole.INVESTOR_UNVERIFIED, UserRole.INVESTOR_VERIFIED].includes(userRole),
    reviewKYC: (userRole: UserRole) => userRole === UserRole.ADMIN,
    approveKYC: (userRole: UserRole) => userRole === UserRole.ADMIN,

    // Banking permissions
    linkBankAccount: (user: { role: UserRole; kycStatus: KYCStatus }) =>
        user.kycStatus === KYCStatus.APPROVED,
    viewOwnBankAccounts: (userRole: UserRole) =>
        [UserRole.INVESTOR_VERIFIED, UserRole.INVESTOR_UNVERIFIED, UserRole.ADMIN].includes(userRole),

    // Dividend permissions
    viewOwnDividends: (userRole: UserRole) =>
        [UserRole.INVESTOR_VERIFIED, UserRole.ADMIN].includes(userRole),
    distributeDividends: (userRole: UserRole) => userRole === UserRole.ADMIN,

    // Document permissions
    viewOwnDocuments: (userRole: UserRole) =>
        [UserRole.INVESTOR_VERIFIED, UserRole.INVESTOR_UNVERIFIED, UserRole.ADMIN].includes(userRole),
    uploadPropertyDocuments: (userRole: UserRole) => userRole === UserRole.ADMIN,

    // Admin permissions
    accessAdminPanel: (userRole: UserRole) => userRole === UserRole.ADMIN,
    viewAnalytics: (userRole: UserRole) => userRole === UserRole.ADMIN,
    manageUsers: (userRole: UserRole) => userRole === UserRole.ADMIN,
    viewAuditLogs: (userRole: UserRole) => userRole === UserRole.ADMIN,
}

export type Permission = keyof typeof permissions
