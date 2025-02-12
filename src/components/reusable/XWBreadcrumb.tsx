'use client'

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const XWBreadcrumb = ({ items }: BreadcrumbProps) => {
    return (
        <div className="flex items-center space-x-2 text-muted-foreground">
            <Link
                href="/assets"
                className="hover:text-primary transition-colors"
            >
                <Home className="h-4 w-4" />
            </Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <ChevronRight className="h-4 w-4" />
                    <Link
                        href={item.href}
                        className="hover:text-primary transition-colors"
                    >
                        {item.label}
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default XWBreadcrumb 