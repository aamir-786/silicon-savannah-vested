import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0'
import prisma from '@/lib/db'
import { kycSchema } from '@/lib/validations'
import { encrypt } from '@/lib/encryption'
import { northCapitalService } from '@/lib/integrations/north-capital'
import { KYCStatus, UserRole } from '@prisma/client'

export async function POST(request: NextRequest) {
    try {
        const session = await getSession()

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        // Validate input
        const validatedData = kycSchema.parse(body)

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Submit to North Capital
        const northCapitalResponse = await northCapitalService.submitKYC({
            legalName: validatedData.legalName,
            dateOfBirth: validatedData.dateOfBirth,
            ssn: validatedData.ssn,
            address: validatedData.address,
            city: validatedData.city,
            state: validatedData.state,
            zipCode: validatedData.zipCode,
            phone: validatedData.phone,
            email: user.email,
        })

        if (!northCapitalResponse.success) {
            return NextResponse.json(
                { error: northCapitalResponse.error },
                { status: 400 }
            )
        }

        // Encrypt SSN before storing
        const encryptedSSN = encrypt(validatedData.ssn)

        // Create or update KYC data
        const kycData = await prisma.kYCData.upsert({
            where: { userId: user.id },
            create: {
                userId: user.id,
                legalName: validatedData.legalName,
                dateOfBirth: new Date(validatedData.dateOfBirth),
                ssn: encryptedSSN,
                address: validatedData.address,
                city: validatedData.city,
                state: validatedData.state,
                zipCode: validatedData.zipCode,
                phone: validatedData.phone,
                northCapitalId: northCapitalResponse.accountId,
                status: KYCStatus.PENDING,
            },
            update: {
                legalName: validatedData.legalName,
                dateOfBirth: new Date(validatedData.dateOfBirth),
                ssn: encryptedSSN,
                address: validatedData.address,
                city: validatedData.city,
                state: validatedData.state,
                zipCode: validatedData.zipCode,
                phone: validatedData.phone,
                northCapitalId: northCapitalResponse.accountId,
                status: KYCStatus.PENDING,
            },
        })

        // Update user KYC status
        await prisma.user.update({
            where: { id: user.id },
            data: { kycStatus: KYCStatus.PENDING },
        })

        // Create audit log
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'KYC_SUBMITTED',
                entity: 'KYCData',
                entityId: kycData.id,
            },
        })

        return NextResponse.json({
            success: true,
            kycData: {
                ...kycData,
                ssn: '***-**-' + validatedData.ssn.slice(-4), // Mask SSN in response
            },
        })
    } catch (error: any) {
        console.error('KYC submission error:', error)

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'KYC submission failed' },
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

        if (!user.kycData) {
            return NextResponse.json({ kycData: null })
        }

        // Mask SSN in response
        const kycData = {
            ...user.kycData,
            ssn: user.kycData.ssn ? '***-**-****' : null,
        }

        return NextResponse.json({ kycData })
    } catch (error) {
        console.error('Get KYC error:', error)
        return NextResponse.json(
            { error: 'Failed to get KYC data' },
            { status: 500 }
        )
    }
}
