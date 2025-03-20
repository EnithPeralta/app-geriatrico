export interface Tab {
    label: string;
    content: React.ReactNode;
    title: string
}
export interface TabsProps {
    tabs: Tab[];
    activeTab: number;
    onClick: (index: number) => void;
}
