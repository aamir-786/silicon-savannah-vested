'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Filter, ArrowLeft } from 'lucide-react'
import { PropertyCard } from '@/components/property/property-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function PropertiesPage() {
    const [properties, setProperties] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchProperties()
    }, [])

    const fetchProperties = async () => {
        try {
            const response = await fetch('/api/properties')
            const data = await response.json()
            setProperties(data.properties || [])
        } catch (error) {
            console.error('Failed to fetch properties:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredProperties = properties.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-mesh">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 text-foreground/80 hover:text-foreground">
                            <ArrowLeft className="h-5 w-5" />
                            <span>Back to Home</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="text-sm font-medium">
                                Dashboard
                            </Link>
                            <Link href="/api/auth/logout">
                                <Button variant="outline" size="sm">Sign Out</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <section className="pt-32 pb-12 px-6">
                <div className="container mx-auto">
                    <h1 className="heading-1 mb-4">Investment Opportunities</h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                        Browse our carefully selected portfolio of premium Kenyan real estate properties
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search properties by name, location, or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Properties Grid */}
            <section className="pb-20 px-6">
                <div className="container mx-auto">
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="premium-card p-6 animate-pulse">
                                    <div className="h-48 bg-muted rounded-lg mb-4"></div>
                                    <div className="h-6 bg-muted rounded mb-2"></div>
                                    <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
                                    <div className="h-20 bg-muted rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredProperties.length === 0 ? (
                        <div className="text-center py-20">
                            <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-2xl font-semibold mb-2">No Properties Found</h3>
                            <p className="text-muted-foreground mb-6">
                                {searchQuery
                                    ? 'Try adjusting your search criteria'
                                    : 'No properties are currently available for investment'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6 text-sm text-muted-foreground">
                                Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProperties.map((property) => (
                                    <PropertyCard key={property.id} property={property} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    )
}
