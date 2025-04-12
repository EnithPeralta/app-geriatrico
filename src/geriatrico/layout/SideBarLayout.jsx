import React from 'react'
import { SideBarComponent } from '../../components'

export const SideBarLayout = ({ children }) => {
    return (
        <div className="main-container">
            <SideBarComponent />
            {children}
        </div>
    )
}
