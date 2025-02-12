import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const TableLoader = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]"><Skeleton className="h-9 w-9" /></TableHead>
                    {[...Array(4)].map((_, index) => (
                        <TableHead key={index}><Skeleton className="h-9 w-full" /></TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(10)].map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                        <TableCell className="w-[50px]">
                            <Skeleton className="h-9 w-9" />
                        </TableCell>
                        {[...Array(4)].map((_, colIndex) => (
                            <TableCell key={colIndex}>
                                <Skeleton className="h-9 w-full" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default TableLoader

