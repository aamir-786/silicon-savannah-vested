import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
    title: string
    value: string | number
    change?: string
    changeType?: 'positive' | 'negative' | 'neutral'
    icon: LucideIcon
    iconColor?: string
}

export function StatCard({
    title,
    value,
    change,
    changeType = 'neutral',
    icon: Icon,
    iconColor = 'text-primary',
}: StatCardProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={cn('p-2 rounded-lg bg-primary/10', iconColor)}>
                        <Icon className="h-5 w-5" />
                    </div>
                    {change && (
                        <span
                            className={cn(
                                'text-sm font-medium',
                                changeType === 'positive' && 'text-green-600',
                                changeType === 'negative' && 'text-red-600',
                                changeType === 'neutral' && 'text-muted-foreground'
                            )}
                        >
                            {change}
                        </span>
                    )}
                </div>
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </CardContent>
        </Card>
    )
}
