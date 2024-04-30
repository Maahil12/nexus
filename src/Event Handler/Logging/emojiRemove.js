const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const theme = require("../../../embedConfig.json");
const Audit_Log = require("../../Schemas.js/auditlog");
const log_actions = require("../../Schemas.js/logactions");
const token = require("../../../encrypt").token(5);
const perm = require("../../../functions").perm;

module.exports = async (client) => {
    client.on(Events.EmojiDelete, async (emoji) => {
        perm(emoji);
        const auditEmbed = new EmbedBuilder()
            .setColor(theme.theme)
            .setTitle("Emoji Deleted")
            .setDescription(`Emoji: ${emoji}`)
            .setTimestamp()
            .setFooter({ text: "Nexus Audit Log System" });

        const data = await Audit_Log.findOne({ Guild: emoji.guild.id });
        let logID = data.Channel;
        if (!logID) return;

        const auditChannel = client.channels.cache.get(logID);
        await auditChannel.send({ embeds: [auditEmbed] }).catch((err) => {});
    });
};
