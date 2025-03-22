import React from "react";
import { TabTitleProps } from "./types";

export const TabTitle = (props: TabTitleProps) => {
    const isActive = props.activeTab === props.tabIndex;
    return (
        <button className={`tab-title ${isActive ? 'tab-title--active' : ''}`}
         type="button" 
         role="tab"
        onClick={props.onClick} 
        title={props.title} 
        tabIndex={isActive ? 0 : -1}
        id={props.tabIndex + props.title} >
            <h2 className={'title' + (isActive ? 'active' : 'not-active')}>{props.title}</h2>
        </button>
    );
};
