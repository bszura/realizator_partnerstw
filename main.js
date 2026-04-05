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

// ===================== REKLAMY =====================

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

const ad3 = `#  🛒 CHERRY SHØP  🛒
## 💸 ⨯ Najlepsza Jakość | Najlepsze Ceny | Błyskawiczna Obsługa
## **🤔 ⨯ Co znajdziesz na naszym serwerze?**
> \`⭐\` **⨯** Mega niskie ceny i ekspresowa realizacja zamówień!
> \`🔧\` **⨯** Dopracowany serwer z profesjonalnym podejściem!
> \`📦\` **⨯** Szeroka oferta pr0duktów!
> \`🎉\` **⨯** Konkursy ze świetnymi nagrodami!
> \`✅\` **⨯** Duża ilość legit checków.
> \`💸\` **⨯** Program partnerski - zarabiaj 0,70 PLN za każde partnerstwo!
## **✨ ⨯ Część naszego asortymentu:**
- \`🛒\` **⨯** **USŁUGI D1SC0RD** -  S3rver B00sty, d3koracje, k0nta D1sc0rd, użytkownicy na serwer oraz N1tr0 B00ST za jedynie __18 PLN!__
- \`🎬\` **⨯** **PLATFORMY VOD** - Netflix, HBO Max, Disney, Canal+ i inne - oglądaj taniej, bez ograniczeń!
- \`📚\` **⨯** **NARZĘDZIA EDUKACYJNE** – K0nta ChatGPT, Odrabiamy oraz inne usługi pomocne w nauce czy pisaniu prac!
- \`💸\` **⨯** **D0ŁADOWANIA DO GIER** - Nie przepłacaj u twórców - kupuj u nas, zawsze w dobrej cenie!
- \`📢\` **⨯** **S0CIAL B00STING** - Obserwacje, polubienia i wyświetlenia na wielu platformach, rozwiń swoje profile!
- \`🌍\` **⨯** **PRYWATNOŚĆ W SIECI** - Zakup odpowiedniego VPN - chroń swoją obecność w sieci!
- \`📲\` **⨯**  **WERYFIKACJA SMS** - Szybkie numery tymczasowe do rejestracji wszędzie, gdzie potrzebujesz!
## \`🛒\` **⨯ DOŁĄCZ DO NAS I KUPUJ W ŚWIETNYCH CENACH!**  
\`👋\` **⨯ Do zobaczenia na serwerze!** 
\`🔗\` [Dołącz teraz!](https://discord.gg/cherryshop)`;

const ad4 = `# 💱 WITAJ NA WYMIENIASZ 💱
**Miejsce stworzone dla ludzi, którzy chcą wymieniać szybko, bezpiecznie i bez zbędnego gadania.**
|| @everyone ||
### Dlaczego Wymieniasz?
**– Przejrzyste zasady i uczciwe prowizje
– Szybkie realizacje bez przeciągania w czasie
– Zweryfikowani realizatorzy i bezpieczny system ticketów
– Regularne konkursy i eventy dla aktywnych
– Stały rozwój serwera**
## AKTUALNIE TRWA KONKURS NA 50 PLN
https://discord.gg/wymieniasz`;

const ad5 = `## 💥 💰 ZGARNIJ KASĘ ZA OPINIĘ! 💰💥
** 3 ZŁOTE za JEDNĄ OPINIĘ – LEGALNIE, SZYBKO, BEZ KOMPLIKACJI! 🔥**
👀 Masz 2 minuty?
💬 Masz coś do powiedzenia?
📲 Masz Discorda?
\`TO ZARABIASZ!\`
Nie musisz inwestować ani złotówki – wystarczy, że podzielisz się swoją opinią!
**✅ CO OFERUJEMY?**
🔹 3 ZŁ za każdą zaakceptowaną opinię
🔹 Proste zadania, zero ściemy
🔹 Płacimy na: BLIK  / PayPal / Kod Blik/LTC
🔹 Nowe zadania codziennie!
🔹 Przyjazna ekipa i pomoc dla nowych
**💡 JAK DOŁĄCZYĆ?**
Kliknij link do serwera Discord 👉 https://discord.gg/AEUuHhh38Q
Przeczytaj zasady i zacznij zarabiać!
🌟 Już wiele użytkowników z nami zarabia 
💸 Nie trać czasu – twoja opinia = twoje pieniądze!
**🔔 DOŁĄCZ TERAZ I ZGARNIJ SWOJE PIERWSZE 3 ZŁ W PARĘ MINUT! 🔔**
**Szukamy Realizatorow partnerstw 80gr/Partnerstwo**`;

const ad6 = `## \`🛒\` **CITSH0P** × CENTRUM ZAKUPÓW
\`🎯\` **× Dlaczego my?**
\`⏰\` **×** Najdłużej na rynku!
-# Jesteśmy na rynku od ponad roku!
\`💸\` **×** Najtaniej w Polsce!
-# Nasz cennik jest najbardziej korzystny!
\`✅\` **×** Najbardziej zaufany!
-# Posiadamy legitne, doświadczone grono sprzedawców!
\`🫡\` **×** Najwyższa jakość!
-# Większość naszych produktów jest objęta gwarancją!
> **Zapraszamy Cię do naszej społeczności!**
> https://discord.gg/citshop`;

const ad7 = `#  🛒 SZYBKI ZAKUP 🛒
## 💸 ⨯ Najlepsza Jakość | Najlepsze Ceny | Błyskawiczna Obsługa
## **🤔 ⨯ Co znajdziesz na naszym serwerze?**
> \`⭐\` **⨯** Mega niskie ceny i ekspresowa realizacja zamówień!
> \`🔧\` **⨯** Dopracowany serwer z profesjonalnym podejściem!
> \`📦\` **⨯** Szeroka oferta pr0duktów!
> \`🎉\` **⨯** Konkursy ze świetnymi nagrodami!
> \`✅\` **⨯** Duża ilość legit checków.
> \`💸\` **⨯** Program partnerski - zarabiaj 0,40 PLN za każde partnerstwo!
## **✨ ⨯ Część naszego asortymentu:**
- \`🛒\` **⨯** **USŁUGI D1SC0RD** -  S3rver B00sty, d3koracje, k0nta D1sc0rd, użytkownicy na serwer oraz N1tr0 B00ST za jedynie __25 PLN!__
- \`🎬\` **⨯** **PLATFORMY VOD** - Netflix, HBO Max, Disney+ i inne - oglądaj taniej, bez ograniczeń!
- \`📚\` **⨯** **NARZĘDZIA EDUKACYJNE** – K0nta ChatGPT, Odrabiamy oraz inne usługi pomocne w nauce czy pisaniu prac!
- \`💸\` **⨯** **D0ŁADOWANIA DO GIER** - Nie przepłacaj u twórców - kupuj u nas, zawsze w dobrej cenie!
- \`📢\` **⨯** **S0CIAL B00STING** - Obserwacje, polubienia i wyświetlenia na wielu platformach, rozwiń swoje profile!
- \`🌍\` **⨯** **PRYWATNOŚĆ W SIECI** - Zakup odpowiedniego VPN - chroń swoją obecność w sieci!
- \`📲\` **⨯**  **WERYFIKACJA SMS** - Szybkie numery tymczasowe do rejestracji wszędzie, gdzie potrzebujesz!
- \`🏅\` **⨯**  **H4ZARD ONLINE** - Dla fanów obstawiania i gier losowych!
## \`🛒\` **⨯ DOŁĄCZ DO NAS I KUPUJ W ŚWIETNYCH CENACH!**  
\`👋\` **⨯ Do zobaczenia na serwerze!** 
\`🔗\` [Dołącz teraz!](https://discord.gg/szybkizakup)`;

const ad8 = `## Serwer gdzie tworzymy boty!
> Hej chciałbyś na swoim discordzie mieć autorskiego bota gdzie wszystko jest **tak jak chcesz?** 
* Benefity \`💻\`
- **Szybki kontakt** \`📞\`
- **Profesjonalizm** \`📋\`
- **Szybki czas realizacji** \`⌛\`
- **Pozytwne opinie** \`💚\`
> Dołącz na naszego discorda już teraz!
> https://discord.gg/dcboty`;

const ALL_ADS = [ad1, ad2, ad3, ad4, ad5, ad6, ad7, ad8];

// ===================== KANAŁY =====================

const PARTNER_CHANNELS = [
  '1442908672899547187',
  '1487559123166822460',
  '1485664071234621440',
  '1476241698207043636',
  '1455561797821141094',
  '1449144356975149358',
  '1429451429273141251',
  '1296167863551529033',
];

const REMINDER_DELAY = 5 * 24 * 60 * 60 * 1000; // 5 dni

const pendingRenewals = new Map();

// ===================== FUNKCJE =====================

function parseDateTime(timeStr, dateStr) {
  // timeStr: "12:41", dateStr: "5.04.2026"
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const [day, month, year] = dateStr.split('.').map(Number);
    const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
    return date.getTime();
  } catch (e) {
    return null;
  }
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

// ===================== EVENTY =====================

client.on('messageCreate', async (message) => {
  if (message.guild) return;
  if (message.createdTimestamp < botStartTime) return;

  const isMe = message.author.id === client.user.id;
  const content = message.content.trim();

  if (isMe) {

    // !reklama — wyślij wszystkie reklamy rozmówcy
    if (content === '!reklama') {
      for (const ad of ALL_ADS) {
        await message.channel.send(ad);
        await new Promise(r => setTimeout(r, 1500));
      }
      console.log(`[!reklama] Wysłano ${ALL_ADS.length} reklam`);
      return;
    }

    // !wstaw HH:MM DD.MM.YYYY — wstaw reklamy od podanego czasu
    if (content.startsWith('!wstaw')) {
      const parts = content.split(' ');
      // oczekiwany format: !wstaw 12:41 5.04.2026
      if (parts.length !== 3) {
        await message.channel.send("❕ Użycie: `!wstaw 12:41 5.04.2026`");
        return;
      }

      const fromTimestamp = parseDateTime(parts[1], parts[2]);
      if (!fromTimestamp || isNaN(fromTimestamp)) {
        await message.channel.send("❕ Nieprawidłowy format daty/godziny. Użyj: `!wstaw 12:41 5.04.2026`");
        return;
      }

      const recipientId = message.channel.recipient?.id;
      if (!recipientId) {
        await message.channel.send("❕ Nie mogę określić rozmówcy.");
        return;
      }

      // Pobierz historię wiadomości (max 100)
      const messages = await message.channel.messages.fetch({ limit: 100 });

      const ads = messages
        .filter(m =>
          m.author.id === recipientId &&
          m.content.includes('https://discord.gg/') &&
          m.createdTimestamp >= fromTimestamp
        )
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp);

      if (ads.size === 0) {
        await message.channel.send(`❕ Nie znalazłem żadnych reklam od ${parts[2]} ${parts[1]}.`);
        return;
      }

      // Wstaw na wszystkie kanały partnerskie
      for (const channelId of PARTNER_CHANNELS) {
        const partnerChannel = await client.channels.fetch(channelId).catch(() => null);
        if (!partnerChannel) {
          console.error(`Nie znaleziono kanału ${channelId}`);
          continue;
        }
        for (const [, ad] of ads) {
          await partnerChannel.send(`${ad.content}\n\nPartnerstwo z: <@${recipientId}>`);
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      await message.channel.send(`✅ Wstawiono ${ads.size} reklamę/reklamy (od ${parts[2]} ${parts[1]}) na ${PARTNER_CHANNELS.length} kanałów.`);
      console.log(`[!wstaw] Wstawiono ${ads.size} reklam od ${parts[2]} ${parts[1]}`);
      return;
    }

    // !odnowa — zapytaj rozmówcę czy chce przypomnienie za 5 dni
    if (content === '!odnowa') {
      const recipientId = message.channel.recipient?.id;
      if (!recipientId) {
        await message.channel.send("❕ Nie mogę określić rozmówcy.");
        return;
      }

      pendingRenewals.set(recipientId, true);
      await message.channel.send("🔔 Czy chcesz za 5 dni znowu nawiązać partnerstwo? Wpisz **tak** lub **nie**.");
      console.log(`[!odnowa] Zapytano ${recipientId}`);
      return;
    }

    return;
  }

  // Odpowiedź rozmówcy na !odnowa
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
