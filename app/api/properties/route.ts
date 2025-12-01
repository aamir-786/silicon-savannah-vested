import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0'
import prisma from '@/lib/db'
import { propertySchema } from '@/lib/validations'
import { PropertyStatus, UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const city = searchParams.get('city')
        const search = searchParams.get('search')

        const where: any = {}

        // Only show ACTIVE and FUNDING properties to non-admins
        const session = await getSession()
        let isAdmin = false

        if (session?.user) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email! },
            })
            isAdmin = user?.role === UserRole.ADMIN
        }

        if (!isAdmin) {
            where.status = { in: [PropertyStatus.ACTIVE, PropertyStatus.FUNDING] }
        } else if (status) {
            where.status = status
        }

        if (city) {
            where.city = city
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
            ]
        }

        const properties = await prisma.property.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ properties })
    } catch (error) {
        console.error('Get properties error:', error)
        return NextResponse.json(
            { error: 'Failed to get properties' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession()

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
        })

        if (!user || user.role !== UserRole.ADMIN) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const validatedData = propertySchema.parse(body)

        // Calculate available shares
        const availableShares = validatedData.totalShares
        const fundingGoal = validatedData.totalShares * validatedData.sharePrice

        const property = await prisma.property.create({
            data: {
                ...validatedData,
                availableShares,
                fundingGoal,
                currentFunding: 0,
                status: PropertyStatus.DRAFT,
            },
        })

        // Create audit log
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'PROPERTY_CREATED',
                entity: 'Property',
                entityId: property.id,
            },
        })

        return NextResponse.json({ property }, { status: 201 })
    } catch (error: any) {
        console.error('Create property error:', error)

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to create property' },
            { status: 500 }
        )
    }
}
