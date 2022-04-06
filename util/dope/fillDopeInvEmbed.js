const { MessageEmbed } = require('discord.js');
const { dWThumbnailPic, dwApiEthConvValue } = require('../../constants');
const { dopeObject } = require('./dopeObj');

exports.fillDopeInvEmbed = (dope, id) => {
        const dopeRoot = dope.dopes.edges[0].node;
        const lastSale = dopeRoot?.listings[0]?.inputs[0]?.amount;
        const dopeMap = new Map(Object.entries(dopeRoot.items));

        for (const keypair of dopeMap) {
            dopeObject[keypair[1].type.toLowerCase()] = keypair[1].fullname;
        }

        const dopeEmbed = new MessageEmbed()
            .setTitle(`Dope #${id} Inventory`)
            .setColor("#2081E2")
            .setFields(
                { name: "⛓️ Neck", value: `${dopeObject.neck}`, inline: true },
                { name: "\u200b", value: "\u200b", inline: true },
                { name: "💍 Ring", value: `${dopeObject.ring}`, inline: true },
                { name: "🦺 Clothes", value: (`${dopeObject.clothes}`), inline: true },
                { name: "\u200b", value: "\u200b", inline: true },
                { name: "🥊 Hand", value: `${dopeObject.hand}`, inline: true },
                { name: "🩲 Waist", value: `${dopeObject.waist}`, inline: true },
                { name: "\u200b", value: "\u200b", inline: true },
                { name: "🗡️ Weapon", value: `${dopeObject.weapon}`, inline: true },
                { name: "👞 Foot", value: `${dopeObject.foot}`, inline: true },
                { name: "\u200b", value: "\u200b", inline: true },
                { name: "🐊 Drugs", value: `${dopeObject.drugs}`, inline: true },
                { name: "🚓 Vehicle", value: `${dopeObject.vehicle}`, inline: false },
                { name: "💸 Last sale", value: `${lastSale ? `\`${lastSale / dwApiEthConvValue} ETH\`` : "none"}`, inline: true},
                { name: "\u200b", value: "\u200b", inline: true},
                { name: "⛵ OpenSea", value: `[Listing](https://opensea.io/assets/0x8707276df042e89669d69a177d3da7dc78bd8723/${id})`, inline: true },
            )
            .setThumbnail(dWThumbnailPic);
        
            return dopeEmbed;
    }