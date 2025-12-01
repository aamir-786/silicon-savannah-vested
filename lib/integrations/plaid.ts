import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid'

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID || ''
const PLAID_SECRET = process.env.PLAID_SECRET || ''
const PLAID_ENV = (process.env.PLAID_ENV || 'sandbox') as 'sandbox' | 'development' | 'production'

const configuration = new Configuration({
    basePath: PlaidEnvironments[PLAID_ENV],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
            'PLAID-SECRET': PLAID_SECRET,
        },
    },
})

const plaidClient = new PlaidApi(configuration)

class PlaidService {
    // Create Link Token
    async createLinkToken(userId: string) {
        try {
            const response = await plaidClient.linkTokenCreate({
                user: {
                    client_user_id: userId,
                },
                client_name: 'Silicon Savannah Vested',
                products: [Products.Auth, Products.Transactions],
                country_codes: [CountryCode.Us],
                language: 'en',
            })

            return {
                success: true,
                linkToken: response.data.link_token,
                expiration: response.data.expiration,
            }
        } catch (error: any) {
            console.error('Plaid Link Token Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.error_message || 'Failed to create link token',
            }
        }
    }

    // Exchange Public Token
    async exchangePublicToken(publicToken: string) {
        try {
            const response = await plaidClient.itemPublicTokenExchange({
                public_token: publicToken,
            })

            return {
                success: true,
                accessToken: response.data.access_token,
                itemId: response.data.item_id,
            }
        } catch (error: any) {
            console.error('Plaid Token Exchange Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.error_message || 'Failed to exchange token',
            }
        }
    }

    // Get Account Information
    async getAccounts(accessToken: string) {
        try {
            const response = await plaidClient.accountsGet({
                access_token: accessToken,
            })

            return {
                success: true,
                accounts: response.data.accounts.map(account => ({
                    accountId: account.account_id,
                    name: account.name,
                    mask: account.mask,
                    type: account.type,
                    subtype: account.subtype,
                    balances: {
                        available: account.balances.available,
                        current: account.balances.current,
                        limit: account.balances.limit,
                    },
                })),
            }
        } catch (error: any) {
            console.error('Plaid Get Accounts Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.error_message || 'Failed to get accounts',
            }
        }
    }

    // Get Auth Information (for ACH)
    async getAuth(accessToken: string) {
        try {
            const response = await plaidClient.authGet({
                access_token: accessToken,
            })

            return {
                success: true,
                accounts: response.data.accounts.map(account => ({
                    accountId: account.account_id,
                    name: account.name,
                    mask: account.mask,
                    type: account.type,
                    subtype: account.subtype,
                })),
                numbers: response.data.numbers,
            }
        } catch (error: any) {
            console.error('Plaid Get Auth Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.error_message || 'Failed to get auth info',
            }
        }
    }

    // Get Balance
    async getBalance(accessToken: string) {
        try {
            const response = await plaidClient.accountsBalanceGet({
                access_token: accessToken,
            })

            return {
                success: true,
                accounts: response.data.accounts.map(account => ({
                    accountId: account.account_id,
                    name: account.name,
                    balances: {
                        available: account.balances.available,
                        current: account.balances.current,
                    },
                })),
            }
        } catch (error: any) {
            console.error('Plaid Get Balance Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.error_message || 'Failed to get balance',
            }
        }
    }

    // Get Institution Information
    async getInstitution(institutionId: string) {
        try {
            const response = await plaidClient.institutionsGetById({
                institution_id: institutionId,
                country_codes: [CountryCode.Us],
            })

            return {
                success: true,
                institution: {
                    id: response.data.institution.institution_id,
                    name: response.data.institution.name,
                    logo: response.data.institution.logo,
                    primaryColor: response.data.institution.primary_color,
                },
            }
        } catch (error: any) {
            console.error('Plaid Get Institution Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.error_message || 'Failed to get institution',
            }
        }
    }

    // Create Processor Token for Dwolla
    async createProcessorToken(accessToken: string, accountId: string) {
        try {
            const response = await plaidClient.processorTokenCreate({
                access_token: accessToken,
                account_id: accountId,
                processor: 'dwolla',
            })

            return {
                success: true,
                processorToken: response.data.processor_token,
            }
        } catch (error: any) {
            console.error('Plaid Processor Token Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.error_message || 'Failed to create processor token',
            }
        }
    }

    // Get Transactions
    async getTransactions(accessToken: string, startDate: string, endDate: string) {
        try {
            const response = await plaidClient.transactionsGet({
                access_token: accessToken,
                start_date: startDate,
                end_date: endDate,
            })

            return {
                success: true,
                transactions: response.data.transactions,
                totalTransactions: response.data.total_transactions,
            }
        } catch (error: any) {
            console.error('Plaid Get Transactions Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.error_message || 'Failed to get transactions',
            }
        }
    }

    // Remove Item
    async removeItem(accessToken: string) {
        try {
            await plaidClient.itemRemove({
                access_token: accessToken,
            })

            return {
                success: true,
            }
        } catch (error: any) {
            console.error('Plaid Remove Item Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.error_message || 'Failed to remove item',
            }
        }
    }
}

export const plaidService = new PlaidService()
