import { ReactNode } from "react";

export interface TabContentProps {
    tabIndex: number;
    activeTab: number | undefined;
    content: ReactNode;
}
