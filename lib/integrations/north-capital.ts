import axios, { AxiosInstance } from 'axios'

const NORTH_CAPITAL_API_URL = process.env.NORTH_CAPITAL_API_URL || ''
const NORTH_CAPITAL_API_KEY = process.env.NORTH_CAPITAL_API_KEY || ''
const NORTH_CAPITAL_CLIENT_ID = process.env.NORTH_CAPITAL_CLIENT_ID || ''

class NorthCapitalService {
    private client: AxiosInstance

    constructor() {
        this.client = axios.create({
            baseURL: NORTH_CAPITAL_API_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${NORTH_CAPITAL_API_KEY}`,
                'clientID': NORTH_CAPITAL_CLIENT_ID,
            },
        })
    }

    // KYC Methods
    async submitKYC(data: {
        legalName: string
        dateOfBirth: string
        ssn: string
        address: string
        city: string
        state: string
        zipCode: string
        phone: string
        email: string
    }) {
        try {
            const response = await this.client.post('/kyc/check', {
                domicile: 'USA',
                firstName: data.legalName.split(' ')[0],
                lastName: data.legalName.split(' ').slice(1).join(' '),
                dob: data.dateOfBirth,
                ssn: data.ssn.replace(/\D/g, ''),
                address1: data.address,
                city: data.city,
                state: data.state,
                zip: data.zipCode,
                phone: data.phone.replace(/\D/g, ''),
                email: data.email,
                ip_address: '0.0.0.0', // Should be actual IP
            })

            return {
                success: true,
                data: response.data,
                accountId: response.data.accountId,
                status: response.data.kycStatus,
            }
        } catch (error: any) {
            console.error('North Capital KYC Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.message || 'KYC submission failed',
            }
        }
    }

    async getKYCStatus(accountId: string) {
        try {
            const response = await this.client.get(`/kyc/status/${accountId}`)

            return {
                success: true,
                status: response.data.kycStatus,
                data: response.data,
            }
        } catch (error: any) {
            console.error('North Capital KYC Status Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to get KYC status',
            }
        }
    }

    // Offering Methods
    async createOffering(data: {
        issuerId: string
        offeringName: string
        offeringType: string
        targetAmount: number
        minInvestment: number
        maxInvestment: number
        startDate: string
        endDate: string
    }) {
        try {
            const response = await this.client.post('/offering/create', {
                issuerId: data.issuerId,
                offeringName: data.offeringName,
                offeringType: data.offeringType,
                targetAmount: data.targetAmount,
                minInvestment: data.minInvestment,
                maxInvestment: data.maxInvestment,
                startDate: data.startDate,
                endDate: data.endDate,
            })

            return {
                success: true,
                offeringId: response.data.offeringId,
                data: response.data,
            }
        } catch (error: any) {
            console.error('North Capital Offering Creation Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to create offering',
            }
        }
    }

    // Investment Methods
    async createInvestment(data: {
        offeringId: string
        accountId: string
        investmentAmount: number
        shares: number
    }) {
        try {
            const response = await this.client.post('/offering/invest', {
                offeringId: data.offeringId,
                accountId: data.accountId,
                investmentAmount: data.investmentAmount,
                shares: data.shares,
                paymentMethod: 'ach',
            })

            return {
                success: true,
                tradeId: response.data.tradeId,
                escrowAccountNumber: response.data.escrowAccountNumber,
                data: response.data,
            }
        } catch (error: any) {
            console.error('North Capital Investment Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.message || 'Investment failed',
            }
        }
    }

    async getInvestmentStatus(tradeId: string) {
        try {
            const response = await this.client.get(`/trade/status/${tradeId}`)

            return {
                success: true,
                status: response.data.tradeStatus,
                data: response.data,
            }
        } catch (error: any) {
            console.error('North Capital Trade Status Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to get trade status',
            }
        }
    }

    // Escrow Methods
    async moveToEscrow(data: {
        tradeId: string
        amount: number
        bankAccountId: string
    }) {
        try {
            const response = await this.client.post('/escrow/deposit', {
                tradeId: data.tradeId,
                amount: data.amount,
                externalAccountId: data.bankAccountId,
            })

            return {
                success: true,
                transactionId: response.data.transactionId,
                data: response.data,
            }
        } catch (error: any) {
            console.error('North Capital Escrow Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.message || 'Escrow deposit failed',
            }
        }
    }

    // Document Methods
    async getRequiredDocuments(offeringId: string) {
        try {
            const response = await this.client.get(`/offering/${offeringId}/documents`)

            return {
                success: true,
                documents: response.data.documents,
            }
        } catch (error: any) {
            console.error('North Capital Documents Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to get documents',
            }
        }
    }

    // Reporting
    async getInvestorReport(accountId: string) {
        try {
            const response = await this.client.get(`/account/${accountId}/report`)

            return {
                success: true,
                data: response.data,
            }
        } catch (error: any) {
            console.error('North Capital Report Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to get report',
            }
        }
    }
}

export const northCapitalService = new NorthCapitalService()
