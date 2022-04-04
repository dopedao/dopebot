exports.wrap = (text, format) => {
    if (!format) {
        return `\`\`\`${text}\`\`\``;
    }

    return `\`\`\`${format}\n${text}\`\`\``;
}