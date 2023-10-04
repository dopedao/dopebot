export const wrap = (text: string, format?: string) => {
    if (!format) {
        return `\`\`\`${text}\`\`\``;
    }

    return `\`\`\`${format}\n${text}\`\`\``;
};
