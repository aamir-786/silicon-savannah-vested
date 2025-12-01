import axios, { AxiosInstance } from 'axios'

const DWOLLA_KEY = process.env.DWOLLA_KEY || ''
const DWOLLA_SECRET = process.env.DWOLLA_SECRET || ''
const DWOLLA_ENVIRONMENT = process.env.DWOLLA_ENVIRONMENT || 'sandbox'

const DWOLLA_API_URL = DWOLLA_ENVIRONMENT === 'production'
    ? 'https://api.dwolla.com'
    : 'https://api-sandbox.dwolla.com'

class DwollaService {
    private client: AxiosInstance
    private accessToken: string | null = null
    private tokenExpiry: number = 0

    constructor() {
        this.client = axios.create({
            baseURL: DWOLLA_API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }

    private async getAccessToken(): Promise<string> {
        // Check if token is still valid
        if (this.accessToken && Date.now() < this.tokenExpiry) {
            return this.accessToken
        }

        try {
            const auth = Buffer.from(`${DWOLLA_KEY}:${DWOLLA_SECRET}`).toString('base64')

            const response = await axios.post(
                `${DWOLLA_API_URL}/token`,
                'grant_type=client_credentials',
                {
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            )

            this.accessToken = response.data.access_token
            this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000 // Refresh 1 min early

            return this.accessToken
        } catch (error: any) {
            console.error('Dwolla Auth Error:', error.response?.data || error.message)
            throw new Error('Failed to authenticate with Dwolla')
        }
    }

    private async makeRequest(method: string, endpoint: string, data?: any) {
        const token = await this.getAccessToken()

        try {
            const response = await this.client.request({
                method,
                url: endpoint,
                data,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            return response.data
        } catch (error: any) {
            console.error(`Dwolla ${method} ${endpoint} Error:`, error.response?.data || error.message)
            throw error
        }
    }

    // Customer Methods
    async createCustomer(data: {
        firstName: string
        lastName: string
        email: string
        type: 'personal' | 'business'
        address1: string
        city: string
        state: string
        postalCode: string
        dateOfBirth?: string
        ssn?: string
    }) {
        try {
            const customerData: any = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                type: data.type,
                address1: data.address1,
                city: data.city,
                state: data.state,
                postalCode: data.postalCode,
            }

            if (data.type === 'personal' && data.dateOfBirth && data.ssn) {
                customerData.dateOfBirth = data.dateOfBirth
                customerData.ssn = data.ssn.replace(/\D/g, '')
            }

            const response = await this.makeRequest('POST', '/customers', customerData)

            const customerId = response.headers?.location?.split('/').pop()

            return {
                success: true,
                customerId,
                customerUrl: response.headers?.location,
            }
        } catch (error: any) {
            console.error('Dwolla Create Customer Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to create customer',
            }
        }
    }

    async getCustomer(customerId: string) {
        try {
            const data = await this.makeRequest('GET', `/customers/${customerId}`)

            return {
                success: true,
                data,
            }
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to get customer',
            }
        }
    }

    // Funding Source Methods
    async createFundingSourceToken(customerId: string) {
        try {
            const data = await this.makeRequest('POST', `/customers/${customerId}/funding-sources-token`)

            return {
                success: true,
                token: data.token,
            }
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to create funding source token',
            }
        }
    }

    async createFundingSource(customerId: string, data: {
        plaidToken: string
        name: string
    }) {
        try {
            const response = await this.makeRequest('POST', `/customers/${customerId}/funding-sources`, {
                plaidToken: data.plaidToken,
                name: data.name,
            })

            const fundingSourceId = response.headers?.location?.split('/').pop()

            return {
                success: true,
                fundingSourceId,
                fundingSourceUrl: response.headers?.location,
            }
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to create funding source',
            }
        }
    }

    async listFundingSources(customerId: string) {
        try {
            const data = await this.makeRequest('GET', `/customers/${customerId}/funding-sources`)

            return {
                success: true,
                fundingSources: data._embedded?.['funding-sources'] || [],
            }
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to list funding sources',
            }
        }
    }

    async getFundingSource(fundingSourceId: string) {
        try {
            const data = await this.makeRequest('GET', `/funding-sources/${fundingSourceId}`)

            return {
                success: true,
                data,
            }
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to get funding source',
            }
        }
    }

    // Transfer Methods
    async createTransfer(data: {
        sourceFundingSourceUrl: string
        destinationFundingSourceUrl: string
        amount: number
        metadata?: Record<string, string>
    }) {
        try {
            const response = await this.makeRequest('POST', '/transfers', {
                _links: {
                    source: {
                        href: data.sourceFundingSourceUrl,
                    },
                    destination: {
                        href: data.destinationFundingSourceUrl,
                    },
                },
                amount: {
                    currency: 'USD',
                    value: data.amount.toFixed(2),
                },
                metadata: data.metadata,
            })

            const transferId = response.headers?.location?.split('/').pop()

            return {
                success: true,
                transferId,
                transferUrl: response.headers?.location,
            }
        } catch (error: any) {
            console.error('Dwolla Transfer Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.message || 'Transfer failed',
            }
        }
    }

    async getTransfer(transferId: string) {
        try {
            const data = await this.makeRequest('GET', `/transfers/${transferId}`)

            return {
                success: true,
                data,
                status: data.status,
            }
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to get transfer',
            }
        }
    }

    // Mass Payment Methods (for dividends)
    async createMassPayment(data: {
        sourceFundingSourceUrl: string
        items: Array<{
            amount: number
            destinationFundingSourceUrl: string
            metadata?: Record<string, string>
        }>
        metadata?: Record<string, string>
    }) {
        try {
            const response = await this.makeRequest('POST', '/mass-payments', {
                _links: {
                    source: {
                        href: data.sourceFundingSourceUrl,
                    },
                },
                items: data.items.map(item => ({
                    _links: {
                        destination: {
                            href: item.destinationFundingSourceUrl,
                        },
                    },
                    amount: {
                        currency: 'USD',
                        value: item.amount.toFixed(2),
                    },
                    metadata: item.metadata,
                })),
                metadata: data.metadata,
            })

            const massPaymentId = response.headers?.location?.split('/').pop()

            return {
                success: true,
                massPaymentId,
                massPaymentUrl: response.headers?.location,
            }
        } catch (error: any) {
            console.error('Dwolla Mass Payment Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.message || 'Mass payment failed',
            }
        }
    }

    async getMassPayment(massPaymentId: string) {
        try {
            const data = await this.makeRequest('GET', `/mass-payments/${massPaymentId}`)

            return {
                success: true,
                data,
                status: data.status,
            }
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to get mass payment',
            }
        }
    }

    // Balance Methods
    async getBalance(fundingSourceId: string) {
        try {
            const data = await this.makeRequest('GET', `/funding-sources/${fundingSourceId}/balance`)

            return {
                success: true,
                balance: parseFloat(data.balance.value),
                currency: data.balance.currency,
            }
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to get balance',
            }
        }
    }
}

export const dwollaService = new DwollaService()
