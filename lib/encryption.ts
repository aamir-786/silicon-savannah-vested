import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ''
const ALGORITHM = 'aes-256-cbc'

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    console.warn('WARNING: ENCRYPTION_KEY must be exactly 32 characters')
}

export function encrypt(text: string): string {
    try {
        const iv = crypto.randomBytes(16)
        const cipher = crypto.createCipheriv(
            ALGORITHM,
            Buffer.from(ENCRYPTION_KEY),
            iv
        )

        let encrypted = cipher.update(text, 'utf8', 'hex')
        encrypted += cipher.final('hex')

        return iv.toString('hex') + ':' + encrypted
    } catch (error) {
        console.error('Encryption error:', error)
        throw new Error('Failed to encrypt data')
    }
}

export function decrypt(text: string): string {
    try {
        const parts = text.split(':')
        const iv = Buffer.from(parts[0], 'hex')
        const encryptedText = parts[1]

        const decipher = crypto.createDecipheriv(
            ALGORITHM,
            Buffer.from(ENCRYPTION_KEY),
            iv
        )

        let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
        decrypted += decipher.final('utf8')

        return decrypted
    } catch (error) {
        console.error('Decryption error:', error)
        throw new Error('Failed to decrypt data')
    }
}

export function hashData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex')
}
