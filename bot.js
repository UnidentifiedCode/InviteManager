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
  if(command === "help"){
    const botInfo = new RichEmbed()
	.setDescription("This is a list of commands you can use. You can get more info about a specific command by using `!help <command>` (e.g. `!help add-ranks`)")
	.setColor("#129C4F")
	.addField("Invites", "`addInvites`, `clearInvites`, `createInvite`, `info`", false)
	.addField("Ranks", "`addRank`, `fixRanks`, `ranks`, `removeRank`", false)
	.addField("Config", "`botConfig`, `config`", false)
	.addField("Info", "`botInfo`, `credits`, `interactiveConfig`, `inviteCodeConfig`, `memberConfig`, `permissions`", false)
	.addField("Premium", "`export`, `premium`, `tryPremium`", false)
	.setTimestamp()
	.setFooter(`${client.user.username}`, client.user.avatarURL);
    message.channel.send(botInfo);
  }
  if(command === "botinfo" || command === "info"){
    const botInfo = new RichEmbed()
	.setAuthor(client.user.username + "info", client.user.avatarURL)
	.setColor("#129C4F")
	.addField("Version", `9.7.0`, true)
	.addField("Uptime", `8 hours`, true)
	.addField("Current Shard", `4 (4)`, true)
	.addField('Premium', `This server currently **does not** have premium.`, false)
	.addField('Support Discord', `https://discord.gg/Am6p2Hs`, false)
	.addField('Add bot to your server', `https://invitemanager.com/add-bot/`, false)
	.addField('Bot website', `https://docs.invitemanager.co/`, false)
    	.addField('Bot website', `https://www.patreon.com/invitemanager`, false)
	.setTimestamp()
	.setFooter(`${client.user.username}`, client.user.avatarURL);
    message.channel.send(botInfo);
  }

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
    logChannel.send(`<@${member.user.id}> **joined**; Invited by **${inviter.username}** (**${invite.uses}** invites)`);
  });
});
//client.login(token);
client.login(process.env.TOKEN)
