import React, { forwardRef} from "react";
import { TabListProps } from "./types";
import { TabTitle } from "../TabTitle/TabTitle";
import "../../../css/tabTittle.css";

export const TabList = forwardRef<HTMLDivElement, TabListProps>(({tabs, activeTab, onClick = () => {}}, ref) => {

    return (
        <div className="tab-container">
            <div className="tab-titles" role="tablist" ref={ref}>
            {tabs.map(({title}, index) => (
                <TabTitle key={index + title} activeTab={activeTab} tabIndex={index} title={title} onClick={() => onClick(index)} />
            )) }
        </div>
        </div>
    );
});
