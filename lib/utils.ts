import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount)
}

export function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num)
}

export function formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`
}

export function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date))
}

export function calculateROI(investment: number, returns: number): number {
    return ((returns - investment) / investment) * 100
}

export function calculateSharesFromAmount(amount: number, pricePerShare: number): number {
    return Math.floor(amount / pricePerShare)
}

export function calculateFundingProgress(current: number, goal: number): number {
    return (current / goal) * 100
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

export function getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export function isValidSSN(ssn: string): boolean {
    const ssnRegex = /^\d{3}-\d{2}-\d{4}$/
    return ssnRegex.test(ssn)
}

export function isValidZipCode(zipCode: string): boolean {
    const zipRegex = /^\d{5}(-\d{4})?$/
    return zipRegex.test(zipCode)
}

export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
    return phoneRegex.test(phone)
}

export function formatSSN(ssn: string): string {
    const cleaned = ssn.replace(/\D/g, '')
    if (cleaned.length === 9) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`
    }
    return ssn
}

export function formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    return phone
}

export function maskSSN(ssn: string): string {
    if (ssn.length >= 4) {
        return `***-**-${ssn.slice(-4)}`
    }
    return '***-**-****'
}

export function maskAccountNumber(accountNumber: string): string {
    if (accountNumber.length >= 4) {
        return `****${accountNumber.slice(-4)}`
    }
    return '****'
}

export async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null
    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message
    if (typeof error === 'string') return error
    return 'An unknown error occurred'
}
