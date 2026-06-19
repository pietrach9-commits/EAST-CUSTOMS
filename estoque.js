const fs = require('fs');
const {
    Events,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');

module.exports = (client) => {

    const canalId = '1517382619556352091';

    // ================= PAINEL AUTOMÁTICO =================
    client.once('clientReady', async () => {

        console.log('📦 Estoque carregado');

        const canal = await client.channels.fetch(canalId).catch(() => null);

        if (!canal) {
            console.log('❌ Canal do baú não encontrado');
            return;
        }

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('menu_bau')
                .setLabel('📦 Baú')
                .setStyle(ButtonStyle.Success)
        );

        await canal.send({
            content: '📦 **Sistema do Baú Ativo**',
            components: [row]
        });

        console.log('✅ Painel do baú enviado');
    });

    // ================= INTERAÇÕES =================
    client.on(Events.InteractionCreate, async interaction => {

        // MENU BAÚ
        if (interaction.isButton() && interaction.customId === 'menu_bau') {

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('bau_entrada')
                    .setLabel('📥 Entrada Baú')
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId('bau_saida')
                    .setLabel('📤 Saída Baú')
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId('bau_ver')
                    .setLabel('📦 Estoque Baú')
                    .setStyle(ButtonStyle.Primary)
            );

            return interaction.reply({
                content: '📦 Menu do Baú',
                components: [row],
                ephemeral: true
            });
        }

        // ================= ENTRADA =================
        if (interaction.isButton() && interaction.customId === 'bau_entrada') {

            const modal = new ModalBuilder()
                .setCustomId('modal_bau_entrada')
                .setTitle('Entrada no Baú');

            const item = new TextInputBuilder()
                .setCustomId('item')
                .setLabel('Nome do item')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const quantidade = new TextInputBuilder()
                .setCustomId('quantidade')
                .setLabel('Quantidade')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(item),
                new ActionRowBuilder().addComponents(quantidade)
            );

            return interaction.showModal(modal);
        }

        // ================= SAÍDA =================
        if (interaction.isButton() && interaction.customId === 'bau_saida') {

            const modal = new ModalBuilder()
                .setCustomId('modal_bau_saida')
                .setTitle('Saída do Baú');

            const item = new TextInputBuilder()
                .setCustomId('item')
                .setLabel('Nome do item')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const quantidade = new TextInputBuilder()
                .setCustomId('quantidade')
                .setLabel('Quantidade')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(item),
                new ActionRowBuilder().addComponents(quantidade)
            );

            return interaction.showModal(modal);
        }

        // ================= MODAL ENTRADA =================
        if (interaction.isModalSubmit() && interaction.customId === 'modal_bau_entrada') {

            let estoque = {};

            if (fs.existsSync('./estoque.json')) {
                estoque = JSON.parse(fs.readFileSync('./estoque.json'));
            }

            const item = interaction.fields.getTextInputValue('item');
            const quantidade = parseInt(interaction.fields.getTextInputValue('quantidade'));

            estoque[item] = (estoque[item] || 0) + quantidade;

            fs.writeFileSync('./estoque.json', JSON.stringify(estoque, null, 2));

            return interaction.reply({
                content: `📥 ${quantidade}x ${item} adicionados ao baú.`,
                ephemeral: true
            });
        }

        // ================= MODAL SAÍDA =================
        if (interaction.isModalSubmit() && interaction.customId === 'modal_bau_saida') {

            let estoque = {};

            if (fs.existsSync('./estoque.json')) {
                estoque = JSON.parse(fs.readFileSync('./estoque.json'));
            }

            const item = interaction.fields.getTextInputValue('item');
            const quantidade = parseInt(interaction.fields.getTextInputValue('quantidade'));

            if (!estoque[item] || estoque[item] < quantidade) {
                return interaction.reply({
                    content: '❌ Quantidade insuficiente no baú.',
                    ephemeral: true
                });
            }

            estoque[item] -= quantidade;

            if (estoque[item] <= 0) {
                delete estoque[item];
            }

            fs.writeFileSync('./estoque.json', JSON.stringify(estoque, null, 2));

            return interaction.reply({
                content: `📤 ${quantidade}x ${item} removidos do baú.`,
                ephemeral: true
            });
        }

        // ================= VER ESTOQUE =================
        if (interaction.isButton() && interaction.customId === 'bau_ver') {

            let estoque = {};

            if (fs.existsSync('./estoque.json')) {
                estoque = JSON.parse(fs.readFileSync('./estoque.json'));
            }

            let lista = Object.entries(estoque)
                .map(([item, qtd]) => `📦 ${item}: ${qtd}`)
                .join('\n');

            if (!lista) lista = 'Baú vazio.';

            return interaction.reply({
                content: `# 📦 ESTOQUE DO BAÚ\n\n${lista}`,
                ephemeral: true
            });
        }

    });
};