export function isInteger(value: string): boolean {
    const num = parseInt(value, 10);
    return !isNaN(num) && value === num.toString() && num >= -2147483648 && num <= 2147483647;
}