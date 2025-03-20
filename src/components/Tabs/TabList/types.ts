import { Tab } from "../types";

export interface TabListProps {
    tabs: Tab[];
    activeTab: number;
    onClick?: (index: number) => void;
}
