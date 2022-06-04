import Sharp from "sharp";

export const svgRenderer = async (svg: string): Promise<Sharp.Sharp>  => {
    const strippedSvg = svg.replace("data:image/svg+xml;base64,", '');
    const encodedSvg = Buffer.from(strippedSvg, "base64");
    const hustlerPng = Sharp(Buffer.from(encodedSvg)).png();

    return hustlerPng;
}