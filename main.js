const { Client, Intents } = require('discord.js-selfbot-v13');
const { MessageEmbed } = require('discord.js-selfbot-v13');
const express = require('express');
const app = express();
const PORT = 8080;
const Discord = require('discord.js-selfbot-v13');

const client = new Client({
  checkUpdate: false,
  readyStatus: false,
});

app.get('/', (req, res) => {
  res.send('Self-bot działa na Render! 🚀');
});

app.listen(PORT, () => {
  console.log(`Serwer pingujący działa na porcie ${PORT}`);
});

client.once('ready', () => {
  console.log(`Zalogowano jako ${client.user.tag}!`);
  console.log(`Bot ${client.user.tag} jest gotowy.`);
});

const serverAd = `
# 🌨️❄️ 𝒁𝒊𝒎𝒐𝒘𝒆 ⛄ 𝑹𝒆𝒌𝒍𝒂𝒎𝒚 ❄️🌨️
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
https://winterboard.pl/
`;

const partneringUsers = new Map();
const partnershipTimestamps = new Map();

// ✅ ZMIANA: cooldown 5 dni zamiast 7
const PARTNERSHIP_COOLDOWN = 5 * 24 * 60 * 60 * 1000;

// ✅ ZMIANA: ID kanału do wysyłania reklam partnerów
const PARTNER_CHANNEL_ID = '1442908672899547187';

client.on('messageCreate', async (message) => {
  if (!message.guild && !message.author.bot && message.author.id !== client.user.id) {
    const now = Date.now();
    const lastPartnership = partnershipTimestamps.get(message.author.id);

    if (lastPartnership && now - lastPartnership < PARTNERSHIP_COOLDOWN) {
      await message.channel.send("⏳ Musisz jeszcze poczekać, zanim będziesz mógł nawiązać kolejne partnerstwo. Spróbuj ponownie za 5 dni.");
      return;
    }

    if (!partneringUsers.has(message.author.id)) {
      partneringUsers.set(message.author.id, null);
      await message.channel.send("🌎 Jeśli chcesz nawiązać partnerstwo, wyślij swoją reklamę (maksymalnie 1 serwer).");
    } else {
      const userAd = partneringUsers.get(message.author.id);

      if (userAd === null) {
        partneringUsers.set(message.author.id, message.content);
        await message.channel.send(`✅ Wstaw naszą reklamę:\n${serverAd}`);
        await message.channel.send("⏰ Daj znać, gdy wstawisz reklamę!");
      } else if (
        message.content.toLowerCase().includes('wstawi') ||
        message.content.toLowerCase().includes('już') ||
        message.content.toLowerCase().includes('gotowe') ||
        message.content.toLowerCase().includes('juz')
      ) {
        await message.channel.send("Czy wymagane jest dołączenie na twój serwer?");
        const filter = m => m.author.id === message.author.id;
        const reply = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).catch(() => null);

        if (reply && !reply.first().content.toLowerCase().includes('nie')) {
          await message.channel.send("Mój właściciel @bRtech za niedługo na pewno dołączy do twojego serwera");
          const notificationUser = await client.users.fetch('782647700403257375');
          await notificationUser.send(`Wymagane dołączenie na serwer:\n${userAd}`);
        }

        const guild = client.guilds.cache.get('1348273862365941780');
        if (!guild) {
          await message.channel.send("❕ Nie znaleziono serwera.");
          return;
        }

        const member = await guild.members.fetch(message.author.id).catch(() => null);
        if (!member) {
          await message.channel.send("❕ Dołącz na serwer, aby kontynuować!");
          return;
        }

        // ✅ ZMIANA: szukanie kanału po ID zamiast po nazwie
        const channel = guild.channels.cache.get(PARTNER_CHANNEL_ID);
        if (!channel) {
          await message.channel.send("Nie znaleziono kanału partnerskiego.");
          return;
        }

        await channel.send(`${userAd}\n\nPartnerstwo z: ${member}`);
        await message.channel.send("✅ Dziękujemy za partnerstwo! W razie jakichkolwiek pytań prosimy o kontakt z użytkownikiem .b_r_tech. (bRtech)");

        partnershipTimestamps.set(message.author.id, now);
        partneringUsers.delete(message.author.id);
      }
    }
  }
});

client.on('guildMemberAdd', async (member) => {
  if (partneringUsers.has(member.id)) {
    const userAd = partneringUsers.get(member.id);
    // ✅ ZMIANA: szukanie kanału po ID zamiast po nazwie
    const channel = member.guild.channels.cache.get(PARTNER_CHANNEL_ID);
    if (channel) {
      await channel.send(`${userAd}\n\nPartnerstwo z: ${member}`);
      const dmChannel = await member.createDM();
      await dmChannel.send("✅ Dziękujemy za dołączenie! Twoja reklama została wstawiona.");
      partneringUsers.delete(member.id);
      partnershipTimestamps.set(member.id, Date.now());
    } else {
      console.error("Nie znaleziono kanału partnerskiego.");
    }
  }
});

client.on('error', (error) => {
  console.error('Błąd Discorda:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Nieobsłużony błąd:', error);
});

client.login(process.env.DISCORD_TOKEN);
