const { Client } = require('discord.js-selfbot-v13');
const express = require('express');
const app = express();
const PORT = 8080;

const client = new Client({ checkUpdate: false, readyStatus: false });

app.get('/', (req, res) => res.send('Self-bot działa na Render! 🚀'));
app.listen(PORT, () => console.log(`Serwer pingujący działa na porcie ${PORT}`));

client.once('ready', () => {
  console.log(`Zalogowano jako ${client.user.tag}!`);
  console.log(`Bot ${client.user.tag} jest gotowy.`);
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

const PARTNERSHIP_COOLDOWN = 5 * 24 * 60 * 60 * 1000;
const PARTNER_CHANNEL_ID = '1485238096319746049';
const GUILD_ID = '1484858033887510560';

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
        console.log('[1] Użytkownik potwierdził wstawienie reklamy');
        await message.channel.send("Czy wymagane jest dołączenie na twój serwer?");

        const filter = m => m.author.id === message.author.id;
        const reply = await message.channel.awaitMessages({ filter, max: 1, time: 60000 }).catch(() => null);

        console.log('[2] Odpowiedź:', reply ? reply.first().content : 'BRAK (timeout)');

        if (!reply) {
          await message.channel.send("⏰ Czas minął, spróbuj ponownie.");
          partneringUsers.delete(message.author.id);
          return;
        }

        const saidNo = reply.first().content.toLowerCase().includes('nie');
        console.log('[3] Powiedział nie:', saidNo);

        if (!saidNo) {
          await message.channel.send("Niedługo wbiję na twój serwer");
        }

        console.log('[4] Szukam guild:', GUILD_ID);
        const guild = await client.guilds.fetch(GUILD_ID).catch((e) => { console.error('Błąd guild:', e.message); return null; });
        if (!guild) {
          await message.channel.send("❕ Nie znaleziono serwera.");
          return;
        }
        console.log('[5] Guild:', guild.name);

        const member = await guild.members.fetch(message.author.id).catch(() => null);
        console.log('[6] Member:', member ? member.displayName : 'nie na serwerze');

        console.log('[7] Szukam kanału:', PARTNER_CHANNEL_ID);
        const channel = await guild.channels.fetch(PARTNER_CHANNEL_ID).catch((e) => { console.error('Błąd channel:', e.message); return null; });
        if (!channel) {
          await message.channel.send("Nie znaleziono kanału partnerskiego.");
          return;
        }
        console.log('[8] Kanał:', channel.name);

        const memberMention = member ? `${member}` : message.author.username;
        await channel.send(`${userAd}\n\nPartnerstwo z: ${memberMention}`);
        console.log('[9] Reklama wysłana!');
        await message.channel.send("✅ Dziękujemy za partnerstwo! W razie jakichkolwiek pytań prosimy o kontakt z użytkownikiem .b_r_tech. (bRtech)");

        partnershipTimestamps.set(message.author.id, now);
        partneringUsers.delete(message.author.id);
        console.log('[10] Partnerstwo zakończone pomyślnie');
      }
    }
  }
});

client.on('guildMemberAdd', async (member) => {
  if (partneringUsers.has(member.id)) {
    const userAd = partneringUsers.get(member.id);
    const channel = await member.guild.channels.fetch(PARTNER_CHANNEL_ID).catch(() => null);
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

client.on('error', (error) => console.error('Błąd Discorda:', error));
process.on('unhandledRejection', (error) => console.error('Nieobsłużony błąd:', error));

client.login(process.env.DISCORD_TOKEN);
