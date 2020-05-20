const { Client, RichEmbed } = require("discord.js");
const { prefix, token } = require("./data/config.json");

const client = new Client({disableEveryone: true});
const wait = require('util').promisify(setTimeout);
const invites = {};

client.on("ready", () => {
  client.user.setActivity(`docs.invitemanager.co!`, { type: "PLAYING" });
  client.user.setStatus("online");
  console.log("Invites are ready...");
  wait(1000);
  client.guilds.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
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

client.on('guildMemberAdd', member => {
  // To compare, we need to load the current invite list.
  member.guild.fetchInvites().then(guildInvites => {
    // This is the *existing* invites for the guild.
    const ei = invites[member.guild.id];
    // Update the cached invites for the guild.
    invites[member.guild.id] = guildInvites;
    // Look through the invites, find the one for which the uses went up.
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
    // This is just to simplify the message being sent below (inviter doesn't have a tag property)
    const inviter = client.users.get(invite.inviter.id);
    // Get the log channel (change to your liking)
    const logChannel = member.guild.channels.find(channel => channel.name === "welcome");
    // A real basic message with the information we need. 
    logChannel.send(`<@${member.user.id}> joined; Invited by **${inviter.username}** ( **${invite.uses}** invites)`);
  });
});
//client.login(token);
client.login(process.env.TOKEN)
