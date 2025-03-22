import React from 'react';
import { SideBarComponent } from '../../components';
import '../../css/informe.css';

export const InformeEnfemeriaPage = () => {
    return (
        <div className="main-container">
            <SideBarComponent />
            <div className="content">
                <div className='report-header'>
                    <h2 className='h4'>Informe de Enfermería</h2>
                    <div className="report-date">19/12/2024</div>
                </div>
            </div>
        </div>
    )
}
