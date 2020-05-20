const { Client, RichEmbed } = require("discord.js");
const { prefix, token } = require("./data/config.json");

const client = new Client({disableEveryone: true});


client.on("ready", () => {
  client.user.setActivity(`docs.invitemanager.co!`, { type: "PLAYING" });
  client.user.setStatus("online");
  console.log("Invites are ready...");
});

client.on("message", async message => {
  
  if(message.author.bot) return;
  if(message.content.indexOf(prefix) !== 0) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  if(command === "botinfo" || command === "info"){
    const botInfo = new RichEmbed()
	.setAuthor(client.user.username + "info", client.user.avatarURL)
	.setColor("#000000")
	.setThumbnail(client.user.displayAvatarURL)
	.addField("👑 Developer", `HaZZe#0001`, true)
	.addField("💎 Support Server", `Soon...`, true)
	.addField("📤 Invite", `Soon...`, true)
	.addField('👤 Total Users', `${client.users.size}`, true)
	.addField('📁 Total Channels:', `${client.channels.size}`, true)
	.addField('🛡 Total Servers', Math.ceil(client.guilds.size), true)
	.addField('\u200b', `Built with discord.js`)
	.setTimestamp()
	.setFooter(`${client.user.username} v0.0.3`, client.user.avatarURL);
    message.channel.send(botInfo);
  }
  if(command === "help" || command === "cmd" || command === "cmds") {
    const botHelp = new RichEmbed()
	.setAuthor(client.user.username + " commands", client.user.avatarURL)
	.setColor("#000000")
	.setThumbnail(client.user.displayAvatarURL)
        .addField(`**${prefix}countdown**`, `**Description:** Death? There's an app for that.\n**Alias:** ${prefix}time, ${prefix}timeleft, ${prefix}tl, ${prefix}cd`)
        .addField(`**${prefix}botinfo**`, `**Description:** Show bot informations.\n**Alias:** ${prefix}info`)
        .addField(`**${prefix}ping**`, `**Description:** Show bot ping.\n**Alias:** None`)
	.setTimestamp()
	.setFooter(`Bot prefix is ${prefix}`, client.user.avatarURL);
	if(message.member.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"])) {
		botHelp.addField(`**${prefix}say**`, `**Description:** Say something through the bot.\n**Usage:** ${prefix}say #channel \n**Alias:** ${prefix}ann`)
		botHelp.addField(`**${prefix}purge**`, `**Description:** Delete some messages from channels.\n**Usage:** ${prefix}purge number_of_messages \n**Alias:** ${prefix}clear`)
	}
    message.channel.send(botHelp);
  }
});

//client.login(token);
client.login(process.env.TOKEN)
