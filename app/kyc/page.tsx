'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function KYCPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        legalName: '',
        dateOfBirth: '',
        ssn: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrors({})

        try {
            const response = await fetch('/api/kyc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                if (data.details) {
                    const newErrors: Record<string, string> = {}
                    data.details.forEach((error: any) => {
                        newErrors[error.path[0]] = error.message
                    })
                    setErrors(newErrors)
                } else {
                    throw new Error(data.error || 'Submission failed')
                }
                return
            }

            setSubmitted(true)
            setTimeout(() => router.push('/dashboard'), 3000)
        } catch (error: any) {
            console.error('KYC submission error:', error)
            setErrors({ general: error.message })
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-mesh flex items-center justify-center px-6">
                <Card className="max-w-md w-full text-center">
                    <CardContent className="pt-12 pb-12">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">KYC Submitted Successfully!</h2>
                        <p className="text-muted-foreground mb-6">
                            Your application is being reviewed. We'll notify you once it's approved.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Redirecting to dashboard...
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-mesh">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b">
                <div className="container mx-auto px-6 py-4">
                    <Link href="/" className="flex items-center gap-2 text-foreground/80 hover:text-foreground">
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </nav>

            <div className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="heading-2 mb-2">Know Your Customer (KYC)</h1>
                        <p className="text-muted-foreground">
                            We need to verify your identity to comply with financial regulations
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>
                                All information is encrypted and stored securely
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {errors.general && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                        {errors.general}
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="legalName">Full Legal Name *</Label>
                                    <Input
                                        id="legalName"
                                        value={formData.legalName}
                                        onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                                        error={errors.legalName}
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                                        <Input
                                            id="dateOfBirth"
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                            error={errors.dateOfBirth}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="ssn">Social Security Number *</Label>
                                        <Input
                                            id="ssn"
                                            type="text"
                                            placeholder="XXX-XX-XXXX"
                                            value={formData.ssn}
                                            onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}
                                            error={errors.ssn}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="address">Street Address *</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        error={errors.address}
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="city">City *</Label>
                                        <Input
                                            id="city"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            error={errors.city}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="state">State *</Label>
                                        <Input
                                            id="state"
                                            placeholder="CA"
                                            maxLength={2}
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                                            error={errors.state}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="zipCode">ZIP Code *</Label>
                                        <Input
                                            id="zipCode"
                                            placeholder="12345"
                                            value={formData.zipCode}
                                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                            error={errors.zipCode}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="(555) 123-4567"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        error={errors.phone}
                                        required
                                    />
                                </div>

                                <div className="bg-muted/50 p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        Security & Privacy
                                    </h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Your SSN is encrypted using AES-256 encryption</li>
                                        <li>• Information is verified through North Capital</li>
                                        <li>• Data is never shared with third parties</li>
                                        <li>• SEC compliant identity verification</li>
                                    </ul>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                    loading={loading}
                                >
                                    Submit KYC Application
                                </Button>

                                <p className="text-xs text-center text-muted-foreground">
                                    By submitting, you agree to our Terms of Service and Privacy Policy
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
