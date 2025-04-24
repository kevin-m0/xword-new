'use client'
import React from 'react'
import { CustomOrganizationSwitcher } from './CustomOrganizationSwitcher'
import CurrentOrganizationComponent from './CurrentOrganizationComponent'

const OrganizationsComponent = () => {
    return (
        <div className='flex flex-col gap-5 p-5'>

            <div className='flex items-center gap-5 justify-between'>
            </div>


            <div className='grid grid-cols-4 gap-5'>
                <CustomOrganizationSwitcher />

                <div className='col-span-3'>
                    <CurrentOrganizationComponent />
                </div>
            </div>

        </div>
    )
}

export default OrganizationsComponent
