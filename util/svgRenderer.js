const Sharp = require('sharp');

module.exports = {
    async svgRenderer(svg) {
        const strippedSvg = svg.replace("data:image/svg+xml;base64,", '');
        const encodedSvg = Buffer.from(strippedSvg, "base64");
        const hustlerPng = await Sharp(Buffer.from(encodedSvg)).png();

        return hustlerPng;
    }
}