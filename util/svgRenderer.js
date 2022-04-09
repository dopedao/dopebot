const Sharp = require('sharp');

exports.svgRenderer = async (svg) => {
    const strippedSvg = svg.replace("data:image/svg+xml;base64,", '');
    const encodedSvg = Buffer.from(strippedSvg, "base64");
    const hustlerPng = Sharp(Buffer.from(encodedSvg)).png();

    return hustlerPng;
}