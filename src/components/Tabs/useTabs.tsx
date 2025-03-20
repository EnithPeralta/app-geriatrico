import { useState, useRef } from "react";
import { TabsProps } from "./types"; // ✅ Corrección en la importación

export const useTabs = (props: TabsProps) => {
    const [activeTabIndex, setActiveTabIndex] = useState<number>(props.activeTab ?? 0);
    const tabsContainerRef = useRef<HTMLDivElement>(null);

    const handleTabChange = (tabIndex: number) => {
        if (tabIndex !== activeTabIndex) {
            setActiveTabIndex(tabIndex);
        }
    };

    return {
        activeTabIndex,
        tabsContainerRef,
        handleTabChange
    };
};
