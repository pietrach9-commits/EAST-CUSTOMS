const fs = require('fs');

module.exports = (client) => {

    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        // ================= !bau =================
        if (message.content === '!bau') {

            const row = {
                type: 1,
                components: [
                    {
                        type: 2,
                        custom_id: 'menu_bau',
                        label: '📦 Baú',
                        style: 3
                    }
                ]
            };

            return message.channel.send({
                content: '📦 **Sistema do Baú Ativo**',
                components: [row]
            });
        }

        // ================= !ponto =================
        if (message.content === '!ponto') {

            const row = {
                type: 1,
                components: [
                    {
                        type: 2,
                        custom_id: 'entrar_ponto',
                        label: '🟢 Entrar em Serviço',
                        style: 3
                    },
                    {
                        type: 2,
                        custom_id: 'sair_ponto',
                        label: '🔴 Sair em Serviço',
                        style: 4
                    }
                ]
            };

            return message.channel.send({
                content: '⏰ **Sistema de Ponto Ativo**',
                components: [row]
            });
        }
    });

};