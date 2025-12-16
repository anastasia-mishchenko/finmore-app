export function validateDate(date?: string): string | undefined {
    if (!date) return undefined;
    const isoLike = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    if (!isoLike.test(date)) {
        throw new Error(
            `Invalid WordPress date format: ${date}. Expected YYYY-MM-DDTHH:mm:ss`
        );
    }
    return date;
}

