import request from 'graphql-request';
import { Constants } from '../constants';
import { IDope } from '../interfaces/IDope';
import { dopeQueries } from '../Queries/dopeQueries';
import { svgRenderer } from './svgRenderer';
import { HasClaimedGear, HasClaimedPaper } from '..';

const getParsedDope = async (dopeId: number, tokenMeta: string) => {
    const hasClaimedGear = await HasClaimedGear(dopeId);
    const hasClaimedPaper = await HasClaimedPaper(dopeId);

    const dope = await request<IDope>(
        Constants.DW_GRAPHQL_API,
        dopeQueries.dopeSellQuery,
        { where: { id: dopeId } }
    );

    const claimed = !hasClaimedPaper ? '✅' : '❌';
    const opened = !hasClaimedGear ? '✅' : '❌';
    const dopeRank = dope.dopes.edges[0].node.rank;
    const metadataString = tokenMeta.split(',')[1];
    const decodedMetadataString = Buffer.from(
        metadataString,
        'base64'
    ).toString('utf-8');
    const metadataObject = JSON.parse(decodedMetadataString);
    const base64ImageString = metadataObject.image.split(',')[1];
    const dopeSVG = await svgRenderer(base64ImageString);

    return { claimed, opened, dopeRank, dopeSVG };
};

export default getParsedDope;
