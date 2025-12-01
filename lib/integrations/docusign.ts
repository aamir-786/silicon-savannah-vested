import axios from 'axios'
import * as jwt from 'jsonwebtoken'

const DOCUSIGN_INTEGRATION_KEY = process.env.DOCUSIGN_INTEGRATION_KEY || ''
const DOCUSIGN_USER_ID = process.env.DOCUSIGN_USER_ID || ''
const DOCUSIGN_ACCOUNT_ID = process.env.DOCUSIGN_ACCOUNT_ID || ''
const DOCUSIGN_PRIVATE_KEY = process.env.DOCUSIGN_PRIVATE_KEY || ''
const DOCUSIGN_API_URL = 'https://demo.docusign.net/restapi'

class DocuSignService {
    private accessToken: string | null = null
    private tokenExpiry: number = 0

    private async getAccessToken(): Promise<string> {
        // Check if token is still valid
        if (this.accessToken && Date.now() < this.tokenExpiry) {
            return this.accessToken
        }

        try {
            // Decode base64 private key
            const privateKey = Buffer.from(DOCUSIGN_PRIVATE_KEY, 'base64').toString('utf-8')

            // Create JWT assertion
            const now = Math.floor(Date.now() / 1000)
            const jwtPayload = {
                iss: DOCUSIGN_INTEGRATION_KEY,
                sub: DOCUSIGN_USER_ID,
                aud: 'account-d.docusign.com',
                iat: now,
                exp: now + 3600,
                scope: 'signature impersonation',
            }

            const token = jwt.sign(jwtPayload, privateKey, { algorithm: 'RS256' })

            // Exchange JWT for access token
            const response = await axios.post(
                'https://account-d.docusign.com/oauth/token',
                new URLSearchParams({
                    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                    assertion: token,
                }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            )

            this.accessToken = response.data.access_token
            this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000

            return this.accessToken
        } catch (error: any) {
            console.error('DocuSign Auth Error:', error.response?.data || error.message)
            throw new Error('Failed to authenticate with DocuSign')
        }
    }

    async createEnvelope(data: {
        signerEmail: string
        signerName: string
        documentName: string
        documentPdf: Buffer | string
        returnUrl: string
    }) {
        try {
            const token = await this.getAccessToken()

            const envelope = {
                emailSubject: `Please sign: ${data.documentName}`,
                documents: [
                    {
                        documentBase64: typeof data.documentPdf === 'string'
                            ? data.documentPdf
                            : data.documentPdf.toString('base64'),
                        name: data.documentName,
                        fileExtension: 'pdf',
                        documentId: '1',
                    },
                ],
                recipients: {
                    signers: [
                        {
                            email: data.signerEmail,
                            name: data.signerName,
                            recipientId: '1',
                            routingOrder: '1',
                            tabs: {
                                signHereTabs: [
                                    {
                                        anchorString: '/sn1/',
                                        anchorUnits: 'pixels',
                                        anchorYOffset: '10',
                                        anchorXOffset: '20',
                                    },
                                ],
                                dateSignedTabs: [
                                    {
                                        anchorString: '/ds1/',
                                        anchorUnits: 'pixels',
                                        anchorYOffset: '10',
                                        anchorXOffset: '20',
                                    },
                                ],
                            },
                        },
                    ],
                },
                status: 'sent',
            }

            const response = await axios.post(
                `${DOCUSIGN_API_URL}/v2.1/accounts/${DOCUSIGN_ACCOUNT_ID}/envelopes`,
                envelope,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )

            return {
                success: true,
                envelopeId: response.data.envelopeId,
                status: response.data.status,
            }
        } catch (error: any) {
            console.error('DocuSign Create Envelope Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to create envelope',
            }
        }
    }

    async createEmbeddedSigningView(envelopeId: string, data: {
        signerEmail: string
        signerName: string
        returnUrl: string
    }) {
        try {
            const token = await this.getAccessToken()

            const viewRequest = {
                returnUrl: data.returnUrl,
                authenticationMethod: 'none',
                email: data.signerEmail,
                userName: data.signerName,
                clientUserId: data.signerEmail,
            }

            const response = await axios.post(
                `${DOCUSIGN_API_URL}/v2.1/accounts/${DOCUSIGN_ACCOUNT_ID}/envelopes/${envelopeId}/views/recipient`,
                viewRequest,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )

            return {
                success: true,
                url: response.data.url,
            }
        } catch (error: any) {
            console.error('DocuSign Embedded View Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to create embedded view',
            }
        }
    }

    async getEnvelopeStatus(envelopeId: string) {
        try {
            const token = await this.getAccessToken()

            const response = await axios.get(
                `${DOCUSIGN_API_URL}/v2.1/accounts/${DOCUSIGN_ACCOUNT_ID}/envelopes/${envelopeId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            )

            return {
                success: true,
                status: response.data.status,
                sentDateTime: response.data.sentDateTime,
                completedDateTime: response.data.completedDateTime,
            }
        } catch (error: any) {
            console.error('DocuSign Get Status Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to get envelope status',
            }
        }
    }

    async downloadDocument(envelopeId: string, documentId: string = '1') {
        try {
            const token = await this.getAccessToken()

            const response = await axios.get(
                `${DOCUSIGN_API_URL}/v2.1/accounts/${DOCUSIGN_ACCOUNT_ID}/envelopes/${envelopeId}/documents/${documentId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    responseType: 'arraybuffer',
                }
            )

            return {
                success: true,
                document: Buffer.from(response.data),
            }
        } catch (error: any) {
            console.error('DocuSign Download Document Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to download document',
            }
        }
    }

    async voidEnvelope(envelopeId: string, reason: string = 'Cancelled by user') {
        try {
            const token = await this.getAccessToken()

            await axios.put(
                `${DOCUSIGN_API_URL}/v2.1/accounts/${DOCUSIGN_ACCOUNT_ID}/envelopes/${envelopeId}`,
                {
                    status: 'voided',
                    voidedReason: reason,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )

            return {
                success: true,
            }
        } catch (error: any) {
            console.error('DocuSign Void Envelope Error:', error.response?.data || error.message)
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to void envelope',
            }
        }
    }
}

export const docusignService = new DocuSignService()
