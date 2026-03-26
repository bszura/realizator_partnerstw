const { Client } = require('discord.js-selfbot-v13');
const express = require('express');
const { createClient } = require('@libsql/client');
const app = express();
const PORT = 8080;

const client = new Client({
  checkUpdate: false,
  readyStatus: false,
});

const db = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_TOKEN,
});

async function initDB() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS partnership_reminders (
      user_id TEXT PRIMARY KEY,
      remind_at INTEGER
    )
  `);
}

app.get('/', (req, res) => res.send('Self-bot działa na Render! 🚀'));
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));

client.once('ready', async () => {
  console.log(`Zalogowano jako ${client.user.tag}!`);
  await initDB();
  startReminderChecker();
});

const serverAd = `TWOJA REKLAMA`;

const PARTNERSHIP_COOLDOWN = 30 * 1000; // 🔥 TESTY
const REMINDER_DELAY = 30 * 1000;

const PARTNER_CHANNEL_ID = '1485238096319746049';
const GUILD_ID = '1484858033887510560';

const sessions = new Map();
const partnershipTimestamps = new Map();

function timeUntilNextPartnership(userId) {
  const last = partnershipTimestamps.get(userId);
  if (!last) return null;

  const remaining = last + PARTNERSHIP_COOLDOWN - Date.now();
  if (remaining <= 0) return null;

  const seconds = Math.floor(remaining / 1000);
  return `${seconds} sekund`;
}

function startReminderChecker() {
  setInterval(async () => {
    const now = Date.now();

    const result = await db.execute({
      sql: 'SELECT user_id FROM partnership_reminders WHERE remind_at <= ?',
      args: [now],
    });

    for (const row of result.rows) {
      const userId = row.user_id;

      await db.execute({
        sql: 'DELETE FROM partnership_reminders WHERE user_id = ?',
        args: [userId],
      });

      partnershipTimestamps.delete(userId);

      const user = await client.users.fetch(userId);
      const dm = await user.createDM();

      sessions.set(userId, { step: 1, userAd: null });

      await dm.send("Jeśli chcesz nawiązać partnerstwo, wyślij swoją reklamę (maksymalnie 1 serwer).");
    }
  }, 5000);
}

client.on('messageCreate', async (message) => {
  if (message.guild) return;
  if (message.author.bot) return;
  if (message.author.id === client.user.id) return;

  const userId = message.author.id;
  const content = message.content.toLowerCase();

  // ❗ COOLDOWN tylko gdy NIE MA SESJI
  if (!sessions.has(userId)) {
    const remaining = timeUntilNextPartnership(userId);

    if (remaining) {
      await message.channel.send(`⏳ Możesz nawiązać kolejne partnerstwo za **${remaining}**.`);
      return;
    }

    // start flow
    sessions.set(userId, { step: 1, userAd: null });
    await message.channel.send("Jeśli chcesz nawiązać partnerstwo, wyślij swoją reklamę (maksymalnie 1 serwer).");
    return;
  }

  const session = sessions.get(userId);

  // 1️⃣ użytkownik wysyła reklamę
  if (session.step === 1) {
    session.userAd = message.content;
    session.step = 2;

    await message.channel.send("Wstaw naszą reklamę:");
    await message.channel.send(serverAd);
    await message.channel.send("Daj znać gdy wstawisz, wpisując np. gotowe.");
    return;
  }

  // 2️⃣ potwierdzenie
  if (session.step === 2) {
    const confirmed =
      content.includes('gotowe') ||
      content.includes('wstawi') ||
      content.includes('juz') ||
      content.includes('już');

    if (!confirmed) return;

    const guild = await client.guilds.fetch(GUILD_ID).catch(() => null);

    if (guild) {
      const member = await guild.members.fetch(userId).catch(() => null);
      const channel = await guild.channels.fetch(PARTNER_CHANNEL_ID).catch(() => null);

      if (channel) {
        const mention = member ? `${member}` : message.author.username;
        await channel.send(`${session.userAd}\n\nPartnerstwo z: ${mention}`);
      }
    }

    session.step = 3;

    await message.channel.send("Czy chcesz za 5 dni znowu nawiązać partnerstwo? Wpisz tak lub nie.");
    return;
  }

  // 3️⃣ decyzja
  if (session.step === 3) {
    // zapisujemy czas partnerstwa
    partnershipTimestamps.set(userId, Date.now());

    if (content.includes('tak')) {
      const remindAt = Date.now() + REMINDER_DELAY;

      await db.execute({
        sql: 'INSERT OR REPLACE INTO partnership_reminders (user_id, remind_at) VALUES (?, ?)',
        args: [userId, remindAt],
      });

      await message.channel.send("OK, przypomnę Ci za 5 dni.");
    } else if (content.includes('nie')) {
      await message.channel.send("OK, dzięki za partnerstwo.");
    } else {
      await message.channel.send("Wpisz tak lub nie.");
      return;
    }

    sessions.delete(userId);
  }
});

client.login(process.env.DISCORD_TOKEN);
