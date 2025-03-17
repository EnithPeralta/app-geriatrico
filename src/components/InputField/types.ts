export interface InputFieldProps {
    label:string;
    type: string;
    name: string;
    value: string; 
    onChange: VoidFunction;
    placeholder: string;
    icon: string; 
    onClick: VoidFunction;
    required: boolean;
}