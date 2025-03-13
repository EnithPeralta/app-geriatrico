export interface CheckoxFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (selectedRoles: string[]) => void; // Ahora acepta un array de roles
}
