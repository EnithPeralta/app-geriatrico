import React, { useEffect, useState } from "react";
import { TabTitleProps } from "./types";

export const TabTitle = (props: TabTitleProps) => {
    const isActive = props.activeTab === props.tabIndex;
    return (
        <button className="" type="button" role="tab"
        onClick={props.onClick} title={props.title} tabIndex={isActive ? 0 : -1}
        id={props.tabIndex + props.title} >
            <h2 className={'title' + (isActive ? 'active' : 'not-active')}>title</h2>
        </button>
    );
};
