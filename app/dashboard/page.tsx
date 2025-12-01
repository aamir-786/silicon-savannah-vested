'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Building2,
    TrendingUp,
    DollarSign,
    PieChart,
    LogOut,
    Settings,
    FileText,
    CreditCard,
    AlertCircle
} from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/property/property-card'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
    const { user, isLoading } = useUser()
    const router = useRouter()
    const [userData, setUserData] = useState<any>(null)
    const [properties, setProperties] = useState<any[]>([])
    const [stats, setStats] = useState({
        totalInvested: 0,
        totalValue: 0,
        totalReturns: 0,
        propertiesOwned: 0,
    })

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/api/auth/login')
        }
    }, [user, isLoading, router])

    useEffect(() => {
        if (user) {
            fetchUserData()
            fetchUserProperties()
        }
    }, [user])

    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/user')
            const data = await response.json()
            setUserData(data.user)
        } catch (error) {
            console.error('Failed to fetch user data:', error)
        }
    }

    const fetchUserProperties = async () => {
        try {
            // This would be an API endpoint for user's investments
            // For now, we'll show sample data
            setProperties([])
            setStats({
                totalInvested: 0,
                totalValue: 0,
                totalReturns: 0,
                propertiesOwned: 0,
            })
        } catch (error) {
            console.error('Failed to fetch properties:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-mesh flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    const needsKYC = !userData?.kycData || userData.kycStatus === 'NOT_STARTED'

    return (
        <div className="min-h-screen bg-mesh">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <Building2 className="h-6 w-6 text-primary" />
                            <span className="font-bold">Silicon Savannah Vested</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <Link href="/properties">
                                <Button variant="ghost" size="sm">Browse Properties</Button>
                            </Link>
                            <Link href="/api/auth/logout">
                                <Button variant="outline" size="sm">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Sign Out
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="pt-24 pb-20 px-6">
                <div className="container mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="heading-2 mb-2">
                            Welcome back, {user.name || user.email}!
                        </h1>
                        <p className="text-muted-foreground">
                            Here's an overview of your investment portfolio
                        </p>
                    </div>

                    {/* KYC Alert */}
                    {needsKYC && (
                        <div className="mb-8">
                            <Card className="border-orange-200 bg-orange-50">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <AlertCircle className="h-6 w-6 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-orange-900 mb-1">
                                                Complete Your KYC Verification
                                            </h3>
                                            <p className="text-sm text-orange-700 mb-4">
                                                You need to complete identity verification before you can invest in properties.
                                                This is required by SEC regulations.
                                            </p>
                                            <Link href="/kyc">
                                                <Button className="bg-orange-600 hover:bg-orange-700">
                                                    Complete KYC Now
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Invested"
                            value={formatCurrency(stats.totalInvested)}
                            icon={DollarSign}
                            iconColor="text-blue-600"
                        />
                        <StatCard
                            title="Current Value"
                            value={formatCurrency(stats.totalValue)}
                            change="+0%"
                            changeType="neutral"
                            icon={TrendingUp}
                            iconColor="text-green-600"
                        />
                        <StatCard
                            title="Total Returns"
                            value={formatCurrency(stats.totalReturns)}
                            change="+0%"
                            changeType="neutral"
                            icon={PieChart}
                            iconColor="text-purple-600"
                        />
                        <StatCard
                            title="Properties Owned"
                            value={stats.propertiesOwned}
                            icon={Building2}
                            iconColor="text-orange-600"
                        />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* My Properties */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>My Properties</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {properties.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                            <h3 className="font-semibold mb-2">No Properties Yet</h3>
                                            <p className="text-sm text-muted-foreground mb-6">
                                                Start building your portfolio by investing in properties
                                            </p>
                                            <Link href="/properties">
                                                <Button>Browse Properties</Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {properties.map((property) => (
                                                <PropertyCard key={property.id} property={property} />
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8 text-sm text-muted-foreground">
                                        No recent activity
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Link href="/properties" className="block">
                                        <Button variant="outline" className="w-full justify-start">
                                            <Building2 className="h-4 w-4 mr-2" />
                                            Browse Properties
                                        </Button>
                                    </Link>
                                    {needsKYC ? (
                                        <Link href="/kyc" className="block">
                                            <Button variant="outline" className="w-full justify-start">
                                                <FileText className="h-4 w-4 mr-2" />
                                                Complete KYC
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <Button variant="outline" className="w-full justify-start" disabled>
                                                <CreditCard className="h-4 w-4 mr-2" />
                                                Link Bank Account
                                            </Button>
                                            <Button variant="outline" className="w-full justify-start" disabled>
                                                <FileText className="h-4 w-4 mr-2" />
                                                View Documents
                                            </Button>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Account Status */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">KYC Status</span>
                                        <span className={`font-semibold ${userData?.kycStatus === 'APPROVED' ? 'text-green-600' :
                                                userData?.kycStatus === 'PENDING' ? 'text-orange-600' :
                                                    'text-gray-600'
                                            }`}>
                                            {userData?.kycStatus || 'Not Started'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Account Type</span>
                                        <span className="font-semibold">
                                            {userData?.role?.replace('_', ' ') || 'Guest'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Member Since</span>
                                        <span className="font-semibold">
                                            {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
