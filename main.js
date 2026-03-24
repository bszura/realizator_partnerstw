
const { Client, Intents } = require('discord.js-selfbot-v13');
const { MessageEmbed } = require('discord.js-selfbot-v13');
const express = require('express');
const app = express();
const PORT = 8080;
const Discord = require('discord.js-selfbot-v13');
// Konfiguracja klienta Discord
const client = new Client({
  checkUpdate: false,
});

// Serwer HTTP do utrzymania aktywności na Render (dla darmowego tieru)
app.get('/', (req, res) => {
  res.send('Self-bot działa na Render! 🚀');
});

app.listen(PORT, () => {
  console.log(`Serwer pingujący działa na porcie ${PORT}`);
});

// Obsługa zdarzeń Discorda
client.once('ready', () => {
  console.log(`Zalogowano jako ${client.user.tag}!`);
});

// Reklama serwera
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

// Lista użytkowników partnerstwa i ich czas ostatniego partnerstwa
const partneringUsers = new Map();
const partnershipTimestamps = new Map();






client.on('messageCreate', async (message) => {
  // Sprawdzenie, czy wiadomość pochodzi od innego użytkownika
  if (!message.guild && !message.author.bot && message.author.id !== client.user.id) {
    const now = Date.now();
    const lastPartnership = partnershipTimestamps.get(message.author.id);

    if (lastPartnership && now - lastPartnership < 5 * 24 * 60 * 60 * 1000) {
      // Jeśli użytkownik chce nawiązać partnerstwo wcześniej niż tydzień, wyślij wiadomość
      await message.channel.send("⏳ Musisz jeszcze poczekać, zanim będziesz mógł nawiązać kolejne partnerstwo. Spróbuj ponownie za tydzień.");
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
      } else if (message.content.toLowerCase().includes('wstawi') || message.content.toLowerCase().includes('już') || message.content.toLowerCase().includes('gotowe') || message.content.toLowerCase().includes('juz')) {
        // Dodajemy pytanie o dołączenie na serwer
        await message.channel.send("Czy wymagane jest dołączenie na twój serwer?");
        const filter = m => m.author.id === message.author.id;
        const reply = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).catch(() => null);

        if (reply && !reply.first().content.toLowerCase().includes('nie')) {
          await message.channel.send("Mój właściciel @bRtech za niedługo na pewno dołączy do twojego serwera");
          const notificationUser = await client.users.fetch('782647700403257375');
          await notificationUser.send(`Wymagane dołączenie na serwer:\n${userAd}`);
        }

        const guild = client.guilds.cache.get('1484858033887510560');
        if (!guild) {
          await message.channel.send("❕ Nie znaleziono serwera.");
          return;
        }

        const member = await guild.members.fetch(message.author.id).catch(() => null);
        if (!member) {
          await message.channel.send("❕ Dołącz na serwer, aby kontynuować!");
          return;
        }

        const channel = guild.channels.cache.find(ch => ch.name === '〔🤝〕partnerstwa' && ch.isText());
        const channel = guild.channels.cache.find(ch => ch.name === '〔🤝〕partnerstwa' && ch.isText());
        if (!channel) {
          await message.channel.send("Nie znaleziono kanału '〔🤝〕partnerstwa'.");
          await message.channel.send("Nie znaleziono kanału '〔🤝〕partnerstwa'.");
          return;
        }


  if (partneringUsers.has(member.id)) {
    // Wyślij wiadomość powitalną lub dalsze instrukcje do użytkownika
    const userAd = partneringUsers.get(member.id);
    const channel = member.guild.channels.cache.find(ch => ch.name === '〔🤝〕partnerstwa' && ch.isText());
    const channel = member.guild.channels.cache.find(ch => ch.name === '〔🤝〕partnerstwa' && ch.isText());
    if (channel) {
      const displayName = member.displayName;
      await channel.send(`${userAd}\n\nPartnerstwo z: ${member}`);
      const dmChannel = await member.createDM();
      await dmChannel.send("✅ Dziękujemy za dołączenie! Twoja reklama została wstawiona.");
      // Usuń użytkownika z mapy partneringUsers
      partneringUsers.delete(member.id);
      // Zaktualizuj czas ostatniego partnerstwa
      const now = Date.now();
      partnershipTimestamps.set(member.id, now);
    } else {
      console.error("Nie znaleziono kanału '💼・partnerstwa'.");
    }
  }
});

// Obsługa błędów
client.on('error', (error) => {
  console.error('Błąd Discorda:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Nieobsłużony błąd:', error);
});

// Logowanie do Discorda
client.login(process.env.DISCORD_TOKEN);
