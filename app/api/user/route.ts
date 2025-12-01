import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0'
import prisma from '@/lib/db'
import { UserRole, KYCStatus } from '@prisma/client'

export async function POST(request: NextRequest) {
    try {
        const session = await getSession()

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { email, name } = session.user

        // Check if user already exists
        let user = await prisma.user.findUnique({
            where: { email: email! },
        })

        if (!user) {
            // Create new user
            const [firstName, ...lastNameParts] = (name || '').split(' ')

            user = await prisma.user.create({
                data: {
                    email: email!,
                    firstName: firstName || '',
                    lastName: lastNameParts.join(' ') || '',
                    role: UserRole.INVESTOR_UNVERIFIED,
                    kycStatus: KYCStatus.NOT_STARTED,
                    clerkId: session.user.sub || '', // Store Auth0 sub as clerkId for now
                },
            })
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error('User sync error:', error)
        return NextResponse.json(
            { error: 'Failed to sync user' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getSession()

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
            include: {
                kycData: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error('Get user error:', error)
        return NextResponse.json(
            { error: 'Failed to get user' },
            { status: 500 }
        )
    }
}
