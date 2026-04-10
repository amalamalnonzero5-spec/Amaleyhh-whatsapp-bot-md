console.log("Bot starting...");

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } =
require("@whiskeysockets/baileys");

const config = require("./config");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const jid = msg.key.remoteJid;
        const text = msg.message.conversation || "";

        console.log("Message:", text);

        // PING COMMAND
        if (text === ".ping") {
            await sock.sendMessage(jid, { text: "Pong ✅" });
        }

        // BOT INFO
        if (text === ".info") {
            await sock.sendMessage(jid, {
                text: `🤖 Bot Name: ${config.botName}\n👑 Owner: ${config.owner}`
            });
        }

        // STICKER (placeholder)
        if (text === ".sticker") {
            await sock.sendMessage(jid, { text: "Sticker feature coming soon 🧩" });
        }
    });
}

startBot();
