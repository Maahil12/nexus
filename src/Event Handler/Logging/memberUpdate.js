const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const theme = require("../../../embedConfig.json");
const Audit_Log = require("../../Schemas.js/auditlog");
const log_actions = require("../../Schemas.js/logactions");
const token = require("../../../encrypt").token(5);
const perm = require("../../../functions").perm;

module.exports = async (client) => {
    client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
        perm(oldMember);
        const auditEmbed = new EmbedBuilder()
            .setColor(theme.theme)
            .setTimestamp()
            .setFooter({ text: "Nexus Audit Log System" });

        const data = await Audit_Log.findOne({ Guild: oldMember.guild.id });
        let logID = data ? data.Member : null;
        if (!logID) return;

        const auditChannel = client.channels.cache.get(logID);
        const changes = [];

        if (oldMember.nickname !== newMember.nickname) {
            changes.push(`Nickname: \`${oldMember.nickname || 'None'}\` → \`${newMember.nickname || 'None'}\``);
        }

        if (!oldMember.roles.cache.equals(newMember.roles.cache)) {
            const oldRoles = oldMember.roles.cache.map(r => r).join(", ");
            const newRoles = newMember.roles.cache.map(r => r).join(", ");
            changes.push(`Roles: \`${oldRoles}\` → \`${newRoles}\``);
        }

        if (changes.length === 0) return;
        const changesText = changes.join('\n');

        auditEmbed
            .setTitle("Member Updated")
            .addFields({ name: "Changes:", value: changesText });

        await auditChannel.send({ embeds: [auditEmbed] }).catch((err) => {});
    });
};
