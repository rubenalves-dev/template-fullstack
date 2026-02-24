export interface SelectItem<T = unknown> {
    value: string | number;
    text: string;
    selected?: boolean;
    data?: T;
}
