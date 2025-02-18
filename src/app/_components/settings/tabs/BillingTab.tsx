import Link from "next/link"

const BillingTab = () => {
    return (
        <div>
            <p>
                Billing is managed per workspace.
                <Link href={"/settings/workspace"} className="text-xw-muted underline ml-2">
                    Go to the current workspace billing page.
                </Link>
            </p>
        </div>
    )
}

export default BillingTab 