import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0'
import prisma from '@/lib/db'
import { UserRole } from '@prisma/client'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const property = await prisma.property.findUnique({
            where: { id: params.id },
            include: {
                investments: {
                    select: {
                        shares: true,
                        amount: true,
                        createdAt: true,
                    },
                },
                documents: {
                    where: {
                        userId: null, // Only property documents, not user-specific
                    },
                },
            },
        })

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 })
        }

        // Calculate total invested and shares sold
        const totalInvested = property.investments.reduce((sum, inv) => sum + inv.amount, 0)
        const sharesSold = property.investments.reduce((sum, inv) => sum + inv.shares, 0)

        return NextResponse.json({
            property: {
                ...property,
                totalInvested,
                sharesSold,
            },
        })
    } catch (error) {
        console.error('Get property error:', error)
        return NextResponse.json(
            { error: 'Failed to get property' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const property = await prisma.property.update({
            where: { id: params.id },
            data: body,
        })

        // Create audit log
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'PROPERTY_UPDATED',
                entity: 'Property',
                entityId: property.id,
                changes: body,
            },
        })

        return NextResponse.json({ property })
    } catch (error) {
        console.error('Update property error:', error)
        return NextResponse.json(
            { error: 'Failed to update property' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        await prisma.property.delete({
            where: { id: params.id },
        })

        // Create audit log
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'PROPERTY_DELETED',
                entity: 'Property',
                entityId: params.id,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete property error:', error)
        return NextResponse.json(
            { error: 'Failed to delete property' },
            { status: 500 }
        )
    }
}
