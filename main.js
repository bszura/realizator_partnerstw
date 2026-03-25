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
app.listen(PORT, () => console.log(`Serwer pingujący działa na porcie ${PORT}`));

client.once('ready', async () => {
  console.log(`Zalogowano jako ${client.user.tag}!`);
  console.log(`Bot ${client.user.tag} jest gotowy.`);
  await initDB();
  startReminderChecker();
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

const partneringUsers = new Map();
const partnershipTimestamps = new Map();
const waitingUsers = new Set(); // użytkownicy w trakcie jakiegokolwiek oczekiwania na odpowiedź

const PARTNERSHIP_COOLDOWN = 5 * 24 * 60 * 60 * 1000;
const REMINDER_DELAY = 15 * 1000; // testy: 15 sekund | produkcja: 5 * 24 * 60 * 60 * 1000
const PARTNER_CHANNEL_ID = '1485238096319746049';
const GUILD_ID = '1484858033887510560';

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
        partneringUsers.delete(userId);
        partnershipTimestamps.delete(userId);

        const user = await client.users.fetch(userId);
        const dm = await user.createDM();
        await dm.send("Partnerstwo?");
      } catch (e) {
        console.error(`Błąd przypomnienia dla ${userId}:`, e.message);
      }
    }
  }, 10 * 1000);
}

async function awaitAnswer(channel, userId, timeout = 60000) {
  waitingUsers.add(userId);
  const filter = m => m.author.id === userId;
  const collected = await channel.awaitMessages({ filter, max: 1, time: timeout }).catch(() => null);
  waitingUsers.delete(userId);
  return collected ? collected.first() : null;
}

client.on('messageCreate', async (message) => {
  if (message.guild) return;
  if (message.author.bot) return;
  if (message.author.id === client.user.id) return;
  if (waitingUsers.has(message.author.id)) return;

  const userId = message.author.id;
  const now = Date.now();

  // --- Sprawdzenie cooldownu ---
  const lastPartnership = partnershipTimestamps.get(userId);
  if (lastPartnership && now - lastPartnership < PARTNERSHIP_COOLDOWN) {
    await message.channel.send("⏳ Musisz jeszcze poczekać przed kolejnym partnerstwem. Spróbuj ponownie za 5 dni.");
    return;
  }

  // --- Krok 1: pierwsze wejście - poproś o reklamę ---
  if (!partneringUsers.has(userId)) {
    partneringUsers.set(userId, null);
    await message.channel.send("🌎 Jeśli chcesz nawiązać partnerstwo, wyślij swoją reklamę (maksymalnie 1 serwer).");
    return;
  }

  const userAd = partneringUsers.get(userId);

  // --- Krok 2: zapisz reklamę i wyślij naszą ---
  if (userAd === null) {
    partneringUsers.set(userId, message.content);
    await message.channel.send("✅ Wstaw naszą reklamę:");
    await message.channel.send(serverAd);
    await message.channel.send("⏰ Daj znać gdy wstawisz, wpisując np. **gotowe**.");
    return;
  }

  // --- Krok 3: użytkownik potwierdził wstawienie reklamy ---
  const confirmed =
    message.content.toLowerCase().includes('wstawi') ||
    message.content.toLowerCase().includes('już') ||
    message.content.toLowerCase().includes('gotowe') ||
    message.content.toLowerCase().includes('juz');

  if (!confirmed) return;

  // --- Pytanie o dołączenie na serwer ---
  await message.channel.send("❓ Czy wymagane jest dołączenie na twój serwer? (tak/nie)");
  const joinReply = await awaitAnswer(message.channel, userId);

  if (!joinReply) {
    await message.channel.send("⏰ Czas minął, spróbuj ponownie.");
    partneringUsers.delete(userId);
    return;
  }

  if (!joinReply.content.toLowerCase().includes('nie')) {
    await message.channel.send("Za niedługo na pewno wbiję na twój serwer.");
  }

  // --- Pobierz serwer ---
  const guild = await client.guilds.fetch(GUILD_ID).catch(() => null);
  if (!guild) {
    await message.channel.send("❕ Nie znaleziono serwera.");
    return;
  }

  // --- Sprawdź czy jest na serwerze ---
  const member = await guild.members.fetch(userId).catch(() => null);
  if (!member) {
    await message.channel.send("❕ Dołącz na serwer, aby kontynuować!");
    return;
  }

  // --- Pobierz kanał partnerski ---
  const channel = await guild.channels.fetch(PARTNER_CHANNEL_ID).catch(() => null);
  if (!channel) {
    await message.channel.send("❕ Nie znaleziono kanału partnerskiego.");
    return;
  }

  // --- Wyślij reklamę na kanał ---
  await channel.send(`${userAd}\n\nPartnerstwo z: ${member}`);
  await message.channel.send("✅ Dziękujemy za partnerstwo!");
  partneringUsers.delete(userId);

  // --- Pytanie o przypomnienie ---
  await message.channel.send("🔔 Czy chcesz za 5 dni znowu nawiązać partnerstwo? Wpisz **tak** lub **nie**.");
  const reminderReply = await awaitAnswer(message.channel, userId, 30000);

  if (!reminderReply) {
    await message.channel.send("⏰ Czas na odpowiedź minął. Do zobaczenia!");
  } else if (reminderReply.content.toLowerCase().includes('tak')) {
    const remindAt = Date.now() + REMINDER_DELAY;
    await db.execute({
      sql: 'INSERT OR REPLACE INTO partnership_reminders (user_id, remind_at) VALUES (?, ?)',
      args: [userId, remindAt],
    });
    await message.channel.send("✅ Super! Przypomnę Ci o partnerstwie za 5 dni.");
  } else {
    await message.channel.send("👋 Rozumiem! Do zobaczenia!");
  }

  // --- Ustaw cooldown dopiero po całym procesie ---
  partnershipTimestamps.set(userId, now);
});

client.on('guildMemberAdd', async (member) => {
  if (partneringUsers.has(member.id)) {
    const userAd = partneringUsers.get(member.id);
    const channel = await member.guild.channels.fetch(PARTNER_CHANNEL_ID).catch(() => null);
    if (channel) {
      await channel.send(`${userAd}\n\nPartnerstwo z: ${member}`);
      const dmChannel = await member.createDM();
      await dmChannel.send("✅ Dziękujemy za partnerstwo!");
      partneringUsers.delete(member.id);
      partnershipTimestamps.set(member.id, Date.now());
    } else {
      console.error("Nie znaleziono kanału partnerskiego.");
    }
  }
});

client.on('error', (error) => console.error('Błąd Discorda:', error));
process.on('unhandledRejection', (error) => console.error('Nieobsłużony błąd:', error));

client.login(process.env.DISCORD_TOKEN);
