export const FormattedPhoneNumber = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');

    const normalized = digits.startsWith('0') ? digits.slice(1) : digits;

    if (normalized.length < 10) return `+63 ${normalized}`;

    return `+63 ${normalized.slice(0, 3)} ${normalized.slice(3, 6)} ${normalized.slice(6)}`;
};
