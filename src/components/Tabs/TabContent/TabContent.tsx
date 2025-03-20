import React from "react";
import { TabContentProps } from "./types";

export const TabContent = (props: TabContentProps) => {

    const isActive = props.activeTab === props.tabIndex;
    return (
        <div id={'content-'+props.tabIndex} role="tabpanel" tabIndex={isActive ? 0 : -1} hidden={!isActive}>
            {props.content}
        </div>
    );
};
