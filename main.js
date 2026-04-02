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
}

async function getReminder(userId) {
  try {
    const result = await db.execute({
      sql: 'SELECT remind_at FROM partnership_reminders WHERE user_id = ?',
      args: [userId],
    });
    if (result.rows.length === 0) return null;
    return result.rows[0].remind_at;
  } catch (e) {
    return null;
  }
}

async function setReminder(userId, remindAt) {
  await db.execute({
    sql: 'INSERT OR REPLACE INTO partnership_reminders (user_id, remind_at) VALUES (?, ?)',
    args: [userId, remindAt],
  });
}

async function deleteReminder(userId) {
  await db.execute({
    sql: 'DELETE FROM partnership_reminders WHERE user_id = ?',
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
});

const ad1 = `# 🌨️❄️ 𝒁𝒊𝒎𝒐𝒘𝒆 ⛄ 𝑹𝒆𝒌𝒍𝒂𝒎𝒚 ❄️🌨️
> ✩ Poszukujesz idealnego serwera *reklamowego*, na którym widnieje wspaniała społeczność?
> • Dłużej nie szukaj! Dołącz do 𝒏𝒂𝒔
### ───────୨⋆｡‧˚❆☃️❆˚‧｡⋆ৎ───────
## ❄️❔❄️ 𝑪𝑶 𝑶𝑭𝑬𝑹𝑼𝑱𝑬𝑴𝒀 ❄️❔❄️
> 
「 ✦ 𝑲𝒐𝒏𝒌𝒖𝒓𝒔𝒚 ✦ 」- Częste konkursy, i giveaway'e. Wielkie nagrody, małe wymagania!
「 ✦ 𝑺𝒕𝒓𝒆𝒇𝒂 4𝒇𝒖𝒏 ✦ 」- Wiele kanałów do zabawy, z członkami, jak i botami!
「 ✦ 𝑬𝒌𝒐𝒏𝒐𝒎𝒊𝒂 ✦ 」- Autorska ekonomia, z wieloma nagrodami! Serwerowe, Reklamy, na pewno znajdziesz coś dla *siebie*
「 ✦ 𝑨𝒕𝑴𝒐𝑺𝒇𝑬𝒓𝑨 ✦ 」- Miła społeczność, która bardzo ciepło Cię przyjmie ❦
「 ✦ 𝑺𝒕𝒓𝒆𝒇𝒂 𝑷𝒐𝒎𝒐𝒄𝒚 ✦ 」- Rozbudowany system zgłoszeń, a także szybka Administracja, gotowa Ci pomóc w każdej chwili
「 ✦ 𝑺𝒛𝒚𝒃𝒌𝒂 𝒘𝒔𝒑𝒐𝒍𝒑𝒓𝒂𝒄𝒂 ✦ 」- realizatorzy, którzy chętnie zawrą z Tobą partnerstwo!
「 ✦ 𝑨𝒖𝒕𝒐𝒓𝒔𝒌𝒊𝒆 𝑩𝒐𝒕𝒚 ✦ 」- Boty, które pozwalają na unikalne doznania!
「 ✦ 𝒌𝒂𝒏𝒂𝒍𝒚 𝒓𝒆𝒌𝒍𝒂𝒎𝒐𝒘𝒆 ✦ 」- Mnóstwo kanałów reklamowych, które pozwolą wypromować Twój serwer!
「 ✦ 𝑳𝒂𝒕𝒘𝒆 𝒘𝒚𝒑𝒓𝒐𝒎𝒐𝒘𝒂𝒏𝒊𝒆 𝒔𝒊𝒆 ✦ 」- Wiele sposobów na reklamowanie serwera, za darmo - jak i płatnie!
### ───────୨⋆｡‧˚❆☃️❆˚‧｡⋆ৎ───────
## ❄️❔❄️ 𝑲𝑶𝑮𝑶 𝑺𝒁𝑼𝑲𝑨𝑴𝒀 ❄️❔❄️
> 
✦***Administracji*** -  która pilnuje porządku
✦***Realizatorów*** -  kasa na partnerstwa
✦***Partnerstw*** - promujmy się nawzajem
✦**Boosterów*** -  wesprzyj nasz serwer
✦***Miła Społeczność*** - rozwijajmy Nasz serwer
✦***Ciebie*** - Wspaniałą osobę!
### ───────୨⋆｡‧˚❆☃️❆˚‧｡⋆ৎ───────
𝑵𝒊𝒆 𝒘𝒊𝒆𝒓𝒛𝒚𝒔𝒛? 𝒔𝒑𝒓𝒂𝒘𝒅𝒛 𝒔𝒂𝒎! 𝑵𝒊𝒆 𝒑𝒐𝒛𝒂𝒍𝒖𝒋𝒆𝒔𝒛
-# *gif:*https://giphy.com/gifs/vZeuprCarBQPL2P8sq
-# Link: 🥶 https://discord.gg/43rMsV9HG7 🥶
Strona naszego serwera:
https://winterboard.pl/`;

const ad2 = `#  🦔︲Taniej! - Nie tylko z nazwy!
## **⭐ ︲ Wiesz dlaczego klienci wybierają NAS?**
> \`💸\` **︲** Najniższe ceny na całym rynku - dlatego nazywamy się "Taniej!" 🙂
> \`⚡\` **︲** Profesjonalna i błyskawiczna obsługa zamówień
> \`📦\` **︲** N1tr0 za 17PLN - działające na DOWOLNYM koncie
> \`🚚\` **︲** Szeroka oferta: waluty do gier, follow na tiktok, streamingówki
> \`🎮\` **︲** Konta ze skinami/grami, boty, programy i WIELE WIĘCEJ
> \`🎉\` **︲** Regularne konkursy o dobre pieniądze
> \`✅\` **︲** Bezpieczne transakcje - ponad 2,800 potwierdzonych zamówień
> \`📩\` **︲** Poszukujemy Realizatorów Partnerstw, płacimy do 1,20 PLN
> \`💸\` **︲** Zarobek za __zapraszanie znajomych__
\`👟\` ︲**Jeśli jesteś wystarczająco szybki, odbierzesz u nas __darmowe N1tro lub pieniądze__**
\`💰\` ︲**Sprzedasz u nas swoje __stare konto__ do gry**
\`👋\` **︲ Do zobaczenia na serwerze!** 
- \`🔗\` [Dołącz teraz!](https://discord.gg/ogtaniej)`;

const REMINDER_DELAY = 5 * 24 * 60 * 60 * 1000; // 5 dni
const PARTNER_CHANNELS = ['1442908672899547187', '1487559123166822460'];

// Przechowuje userId → oczekuje na odpowiedź "tak/nie" dla !odnowa
const pendingRenewals = new Map();

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
        await deleteReminder(userId);
        const user = await client.users.fetch(userId);
        const dm = await user.createDM();
        await dm.send("⏰ Minęło 5 dni! Czy chcesz nawiązać nowe partnerstwo?");
      } catch (e) {
        console.error(`Błąd przypomnienia dla ${userId}:`, e.message);
      }
    }
  }, 10 * 1000);
}

client.on('messageCreate', async (message) => {
  // Tylko DM
  if (message.guild) return;
  if (message.createdTimestamp < botStartTime) return;

  const isMe = message.author.id === client.user.id;
  const content = message.content.trim();

  // --- Komendy (tylko ja mogę je wpisywać) ---
  if (isMe) {

    // !reklama — wyślij obie reklamy rozmówcy
    if (content === '!reklama') {
      const channel = message.channel;
      await channel.send(ad1);
      await channel.send(ad2);
      console.log(`[!reklama] Wysłano reklamy`);
      return;
    }

    // !wstaw — znajdź wszystkie wiadomości z discord.gg w tej rozmowie i wstaw na kanały
    if (content === '!wstaw') {
      const channel = message.channel;

      // Pobierz historię wiadomości (max 100)
      const messages = await channel.messages.fetch({ limit: 100 });
      const ads = messages.filter(m =>
        m.author.id !== client.user.id &&
        m.content.includes('https://discord.gg/')
      );

      if (ads.size === 0) {
        await channel.send("❕ Nie znalazłem żadnych wiadomości z linkiem discord.gg w tej rozmowie.");
        return;
      }

      // Wstaw każdą reklamę na oba kanały partnerskie
      for (const partnerChannelId of PARTNER_CHANNELS) {
        const partnerChannel = await client.channels.fetch(partnerChannelId).catch(() => null);
        if (!partnerChannel) {
          console.error(`Nie znaleziono kanału ${partnerChannelId}`);
          continue;
        }
        for (const [, ad] of ads.reverse()) {
          await partnerChannel.send(ad.content);
        }
      }

      await channel.send(`✅ Wstawiono ${ads.size} reklamę/reklamy na kanały partnerskie.`);
      console.log(`[!wstaw] Wstawiono ${ads.size} reklam`);
      return;
    }

    // !odnowa — zapytaj rozmówcę czy chce przypomnienie za 5 dni
    if (content === '!odnowa') {
      const channel = message.channel;
      const recipientId = channel.recipient?.id;

      if (!recipientId) {
        await channel.send("❕ Nie mogę określić rozmówcy.");
        return;
      }

      pendingRenewals.set(recipientId, true);
      await channel.send("🔔 Czy chcesz za 5 dni znowu nawiązać partnerstwo? Wpisz **tak** lub **nie**.");
      console.log(`[!odnowa] Zapytano ${recipientId}`);
      return;
    }

    return; // ignoruj inne wiadomości ode mnie
  }

  // --- Odpowiedź rozmówcy na !odnowa ---
  if (pendingRenewals.has(message.author.id)) {
    const answer = content.toLowerCase();

    if (answer.includes('tak')) {
      const remindAt = Date.now() + REMINDER_DELAY;
      await setReminder(message.author.id, remindAt);
      await message.channel.send("✅ Super! Przypomnę Ci o partnerstwie za 5 dni.");
      pendingRenewals.delete(message.author.id);
    } else if (answer.includes('nie')) {
      await message.channel.send("👋 Rozumiem! Do zobaczenia!");
      pendingRenewals.delete(message.author.id);
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
