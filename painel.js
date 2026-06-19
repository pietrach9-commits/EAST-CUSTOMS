const {
    Events,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

module.exports = (client) => {

    client.once('clientReady', async () => {

        console.log(`📌 Painel carregado`);

        const canalId = '1517386588106002502';

        const canal = await client.channels.fetch(canalId).catch(() => null);
        if (!canal) return console.log('❌ Canal do ponto não encontrado');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('entrar_ponto')
                .setLabel('🟢 Entrar em Serviço')
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId('sair_ponto')
                .setLabel('🔴 Sair em Serviço')
                .setStyle(ButtonStyle.Danger)
        );

        await canal.send({
            content: '⏰ Sistema de Ponto',
            components: [row]
        });

        console.log('✅ Painel de ponto enviado');
    });

    client.on(Events.InteractionCreate, async interaction => {

        if (!interaction.isButton()) return;

        if (interaction.customId === 'entrar_ponto') {
            return interaction.reply({
                content: '🟢 Você entrou em serviço.',
                ephemeral: true
            });
        }

        if (interaction.customId === 'sair_ponto') {
            return interaction.reply({
                content: '🔴 Você saiu de serviço.',
                ephemeral: true
            });
        }
    });
};