import { SelectItem } from '../types';

export function toSelectItems<T>(
    items: T[],
    textKey: keyof T,
    valueKey: keyof T,
    selected?: (item: T) => boolean,
): SelectItem<T>[] {
    return items.map((item) => ({
        text: String(item[textKey]),
        value: String(item[valueKey]),

        data: item,
    }));
}
