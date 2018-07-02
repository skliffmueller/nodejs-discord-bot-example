
const Discord = require('discord.js');
const client = new Discord.Client();

const server = require('./server');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
//   if (msg.content === 'ping') {
//     msg.reply('pong');
//   }
});

client.login('NDQyMTA3ODY4NDMxMjUzNTI2.Dc6BtQ.4LpmH6LpiCUzqcsvihZk52q-Glw');

const routes = [{
    method:'GET',
    uri:'*',
    handler:sendOK
},{
    method:'POST',
    uri:'/user',
    handler:user
},{
    method:'POST',
    uri:'/channel',
    handler:channel
}]

function sendOK(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('OK\n');
}

function user(req, res) {
    let split = req.body.username.split('#');
    let user = client.users.find((u) => {
        if(split.length==2) {
            return !u.bot && u.username==split[0] && u.discriminator==split[1];
        } else {
            return !u.bot && u.username==split[0];
        }
    })
    if(!user) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('User not found\n');
        return;
    }
    user.send(req.body.message);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Success\n');
}

function channel(req, res) {
    let channel = client.channels.find((c) => {
        return c.type == 'text' && c.name==req.body.channel;
    });
    if(!channel) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Channel not found\n');
        return;
    }
    channel.send(req.body.message);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Success\n');
}

server('127.0.0.1', 3000, routes);