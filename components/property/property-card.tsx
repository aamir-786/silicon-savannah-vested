'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Building2, MapPin, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatPercentage } from '@/lib/utils'

interface PropertyCardProps {
    property: {
        id: string
        title: string
        shortDescription: string
        city: string
        state: string
        country: string
        images: string[]
        sharePrice: number
        totalShares: number
        availableShares: number
        fundingGoal: number
        currentFunding: number
        expectedAnnualReturn: number
        propertyType: string
    }
}

export function PropertyCard({ property }: PropertyCardProps) {
    const fundingProgress = (property.currentFunding / property.fundingGoal) * 100
    const sharesSold = property.totalShares - property.availableShares

    return (
        <Card className="group overflow-hidden">
            <div className="relative h-48 overflow-hidden">
                {property.images.length > 0 ? (
                    <img
                        src={property.images[0]}
                        alt={property.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                        <Building2 className="h-16 w-16 text-muted-foreground" />
                    </div>
                )}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold">
                    {property.propertyType}
                </div>
            </div>

            <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 line-clamp-1">{property.title}</h3>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{property.city}, {property.state}, {property.country}</span>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {property.shortDescription}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <div className="text-xs text-muted-foreground mb-1">Share Price</div>
                        <div className="text-lg font-bold">{formatCurrency(property.sharePrice)}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground mb-1">Expected Return</div>
                        <div className="text-lg font-bold text-green-600">
                            {formatPercentage(property.expectedAnnualReturn)}
                        </div>
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Funding Progress</span>
                        <span className="font-semibold">{fundingProgress.toFixed(1)}%</span>
                    </div>
                    <Progress value={property.currentFunding} max={property.fundingGoal} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatCurrency(property.currentFunding)} raised</span>
                        <span>{formatCurrency(property.fundingGoal)} goal</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{sharesSold} shares sold</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{property.availableShares} available</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
                <Link href={`/properties/${property.id}`} className="w-full">
                    <Button className="w-full">View Details</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
