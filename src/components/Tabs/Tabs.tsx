import React from "react";
import { TabsProps } from "./types";
import { TabContent } from "./TabContent/TabContent";
import { TabList } from "./TabList/TabList";
import { useTabs } from "./useTabs";

export const Tabs = ({ tabs, activeTab, onClick }: TabsProps) => {
    const { activeTabIndex, tabsContainerRef, handleTabChange } = useTabs({ tabs, activeTab , onClick});

    return (
        <div className="tabs" ref={tabsContainerRef}>
            <TabList tabs={tabs} activeTab={activeTabIndex} onClick={handleTabChange} />
            <div className="tabs-container">
                {tabs.map(({ content }, index) => (
                    <TabContent
                        key={index}
                        tabIndex={index}
                        activeTab={activeTabIndex}
                        content={content}
                    />
                ))}
            </div>
        </div>
    );
};
