export const handleErr = (error: unknown) => {
    if (error instanceof Error) {
        return Promise.reject(error.message);
    }

    return Promise.reject(error);
}
