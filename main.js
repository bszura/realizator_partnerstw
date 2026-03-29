const { Client } = require('discord.js-selfbot-v13');
const express = require('express');
const { createClient } = require('@libsql/client');
const app = express();
const PORT = 8080;

const client = new Client({
  checkUpdate: false,
  readyStatus: false,
  ws: {
    properties: {
      browser: 'Discord iOS',
    }
  }
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
  await db.execute(`
    CREATE TABLE IF NOT EXISTS partnership_cooldowns (
      user_id TEXT PRIMARY KEY,
      last_partnership INTEGER
    )
  `);
}

async function getCooldown(userId) {
  try {
    const result = await db.execute({
      sql: 'SELECT last_partnership FROM partnership_cooldowns WHERE user_id = ?',
      args: [userId],
    });
    if (result.rows.length === 0) return null;
    return result.rows[0].last_partnership;
  } catch (e) {
    return null;
  }
}

async function setCooldown(userId) {
  await db.execute({
    sql: 'INSERT OR REPLACE INTO partnership_cooldowns (user_id, last_partnership) VALUES (?, ?)',
    args: [userId, Date.now()],
  });
}

async function deleteCooldown(userId) {
  await db.execute({
    sql: 'DELETE FROM partnership_cooldowns WHERE user_id = ?',
    args: [userId],
  });
}

app.get('/', (req, res) => res.send('Self-bot działa na Render! 🚀'));
app.listen(PORT, () => console.log(`Serwer pingujący działa na porcie ${PORT}`));

const botStartTime = Date.now();

client.once('ready', async () => {
  console.log(`Zalogowano jako ${client.user.tag}!`);
  console.log(`Bot ${client.user.tag} jest gotowy.`);
  await initDB();
  startReminderChecker();

  // Wiadomość co 1h 1min
  setInterval(async () => {
    const channel = await client.channels.fetch('1346609247869337701').catch(() => null);
    if (channel) await channel.send('# Partnerstwo PV\nWymagania:\n1. Minimum 100 osób\n2. Oznaczenie mnie w reklamie\n3. Pozostanie na serwerze');
  }, 61 * 60 * 1000);
});

const serverAd = `
#  🦔︲Taniej! - Nie tylko z nazwy!

## **⭐ ︲ Wiesz dlaczego klienci wybierają NAS?**

> 💜 **︲** Profesjonalne podejście sprzedawców do użytkowników
> 💸 **︲** Najniższe ceny na całym rynku - dlatego nazywamy się "Taniej!" 🙂
> 📦 **︲** N1tr0 za 17PLN - działające na DOWOLNYM koncie
> 🚚 **︲** Szeroka oferta: konta/waluty do gier, social boost itd.
> 🎉 **︲** Regularne konkursy o dobre pieniądze
> ✅ **︲** Właściciel posiada ponad **2800** potwierdzonych legitchecków
> ⚡ **︲** Natychmiastowa odpowiedź na ticketach
> 💸 **︲** Aktualnie płacimy za __zaproszenia__ oraz napisanie __propozycji__
> 📩 **︲** Poszukujemy Realizatorów Partnerstw, zarabiaj do 1.20 PLN za każde partnerstwo!

## 🛒 **︲ Dołącz do nas, aktualnie sprzedajemy N1tr0 za 17PLN - najtaniej na całym rynku - nie może cie zabraknąć:)**  
👋 **︲ Do zobaczenia na serwerze!** 
🔗 [Dołącz teraz!](https://discord.gg/ogtaniej)
`;

const PARTNERSHIP_COOLDOWN = 3 * 24 * 60 * 60 * 1000; // 3 dni
const REMINDER_DELAY = 3 * 24 * 60 * 60 * 1000;       // 3 dni
const PARTNER_CHANNEL_ID = '1487559123166822460';
const GUILD_ID = '1484858033887510560';

const sessions = new Map();

async function timeUntilNextPartnership(userId) {
  const last = await getCooldown(userId);
  if (!last) return null;
  const remaining = last + PARTNERSHIP_COOLDOWN - Date.now();
  if (remaining <= 0) return null;
  const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
  if (days > 0) return `${days} dni i ${hours} godzin`;
  if (hours > 0) return `${hours} godzin i ${minutes} minut`;
  if (minutes > 0) return `${minutes} minut i ${seconds} sekund`;
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
      try {
        await db.execute({
          sql: 'DELETE FROM partnership_reminders WHERE user_id = ?',
          args: [userId],
        });

        await deleteCooldown(userId);
        sessions.delete(userId);

        const user = await client.users.fetch(userId);
        const dm = await user.createDM();
        await dm.send("⏰ Minęły 3 dni! Jeśli chcesz nawiązać partnerstwo, wyślij mi wiadomość.");
      } catch (e) {
        console.error(`Błąd przypomnienia dla ${userId}:`, e.message);
      }
    }
  }, 5 * 1000);
}

client.on('messageCreate', async (message) => {
  if (message.guild) return;
  if (message.author.bot) return;
  if (message.author.id === client.user.id) return;
  if (message.createdTimestamp < botStartTime) return;

  const userId = message.author.id;
  const content = message.content.toLowerCase();

  // Sprawdź cooldown — tylko jeśli brak aktywnej sesji
  if (!sessions.has(userId)) {
    const remaining = await timeUntilNextPartnership(userId);
    if (remaining) {
      await message.channel.send(`⏳ Możesz nawiązać kolejne partnerstwo za **${remaining}**.`);
      return;
    }
  }

  const session = sessions.get(userId) || { step: 0, userAd: null };

  // Krok 0 → 1: pierwsze wejście
  if (session.step === 0) {
    sessions.set(userId, { step: 1, userAd: null });
    await message.channel.send("🌎 Jeśli chcesz nawiązać partnerstwo, wyślij swoją reklamę (maksymalnie 1 serwer).");
    return;
  }

  // Krok 1 → 2: użytkownik wysłał reklamę
  if (session.step === 1) {
    session.userAd = message.content;
    session.step = 2;
    await message.channel.send("✅ Wstaw naszą reklamę:");
    await message.channel.send(serverAd);
    await message.channel.send("⏰ Daj znać gdy wstawisz, wpisując np. **gotowe**.");
    return;
  }

  // Krok 2 → 3: użytkownik potwierdził wstawienie
  if (session.step === 2) {
    const confirmed =
      content.includes('wstawi') ||
      content.includes('już') ||
      content.includes('gotowe') ||
      content.includes('juz');

    if (!confirmed) return;

    const guild = await client.guilds.fetch(GUILD_ID).catch(() => null);
    if (!guild) {
      await message.channel.send("❕ Nie znaleziono serwera.");
      return;
    }

    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) {
      await message.channel.send("❕ Dołącz na serwer, aby kontynuować!");
      return;
    }

    const channel = await guild.channels.fetch(PARTNER_CHANNEL_ID).catch(() => null);
    if (!channel) {
      await message.channel.send("❕ Nie znaleziono kanału partnerskiego.");
      return;
    }

    await channel.send(`${session.userAd}\n\nPartnerstwo z: ${member}`);
    await setCooldown(userId);
    session.step = 3;

    await message.channel.send("🔔 Czy chcesz za 3 dni znowu nawiązać partnerstwo? Wpisz **tak** lub **nie**.");
    return;
  }

  // Krok 3: odpowiedź na pytanie o przypomnienie
  if (session.step === 3) {
    if (content.includes('tak')) {
      const remindAt = Date.now() + REMINDER_DELAY;
      await db.execute({
        sql: 'INSERT OR REPLACE INTO partnership_reminders (user_id, remind_at) VALUES (?, ?)',
        args: [userId, remindAt],
      });
      await message.channel.send("✅ Super! Przypomnę Ci o partnerstwie za 3 dni.");
      sessions.delete(userId);
    } else if (content.includes('nie')) {
      await message.channel.send("👋 Rozumiem! Do zobaczenia!");
      sessions.delete(userId);
    } else {
      await message.channel.send("❓ Wpisz **tak** lub **nie**.");
    }
    return;
  }
});

client.on('error', (error) => console.error('Błąd Discorda:', error));
process.on('unhandledRejection', (error) => console.error('Nieobsłużony błąd:', error));

console.log('Próbuję się zalogować...');
client.login(process.env.DISCORD_TOKEN).then(() => {
  console.log('Login promise resolved');
}).catch((e) => {
  console.error('Błąd logowania:', e.message);
});
