
import { Client } from 'discord.js-selfbot-v13';
import fs from 'fs';
import { exec } from 'child_process';

const TOKEN = 'YOUR_TOKEN_HERE'; // <-- Thay bằng token thật
const client = new Client();
let spamming = false;

// ==== Chống crash ====
process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));
process.on('uncaughtExceptionMonitor', (err) => console.error('Monitor Exception:', err));

// ==== Khi bot hoạt động ====
client.on('ready', () => {
  console.log(`✅ Đã đăng nhập với ${client.user.username}`);
});

// ==== Lệnh xử lý ====
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('.')) return;
  if (message.author.id !== client.user.id) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // .spam <file.txt>
  if (command === 'spam') {
    const fileName = args[0];
    if (!fileName) return message.channel.send('Thiếu tên file.');

    if (spamming) return message.channel.send('Đang spam rồi!');

    try {
      const lines = fs.readFileSync(fileName, 'utf-8').split('\n');
      spamming = true;
      message.channel.send('Bắt đầu spam...');

      for (const line of lines) {
        if (!spamming) break;
        await message.channel.send(line.trim());
        await new Promise(r => setTimeout(r, 1500));
      }
    } catch {
      message.channel.send('Không tìm thấy file.');
    }
  }

  // .stopspam
  if (command === 'stopspam') {
    spamming = false;
    message.channel.send('Đã dừng spam.');
  }

  // .ping
  if (command === 'ping') {
    const ping = Date.now() - message.createdTimestamp;
    message.channel.send(`Pong! Độ trễ: ${ping}ms`);
  }

  // .kiss @user
  if (command === 'kiss') {
    const user = message.mentions.users.first();
    if (!user) return message.channel.send('Tag ai đó để hôn!');
    const gif = 'https://i.ibb.co/hRqqdnp2/Anime-Kiss-GIF-Anime-Kiss-Love-Discover-Share-GIFs.gif';
    message.channel.send({
      content: `${message.author.username} đã hôn ${user.username} một cái!`,
      files: [gif]
    });
  }

  // .dam @user
  if (command === 'dam') {
    const user = message.mentions.users.first();
    if (!user) return message.channel.send('Tag ai đó để đấm!');
    const gif = 'https://i.ibb.co/JjDC0BC4/anime-smash.gif';
    message.channel.send({
      content: `${message.author.username} đấm mạnh ${user.username}!`,
      files: [gif]
    });
  }

  // .gid @user | sv | channel
  if (command === 'gid') {
    if (args[0] === 'sv') {
      message.channel.send(`ID Server: ${message.guild?.id || 'Không xác định'}`);
    } else if (args[0] === 'channel') {
      message.channel.send(`ID Kênh: ${message.channel.id}`);
    } else if (message.mentions.users.first()) {
      message.channel.send(`ID người dùng: ${message.mentions.users.first().id}`);
    } else {
      message.channel.send('Dùng: `.gid @user`, `.gid sv`, hoặc `.gid channel`');
    }
  }

  // .restart
  if (command === 'restart') {
    await message.channel.send('♻️ Đang khởi động lại bot...');
    exec(`node ${process.argv[1]}`, (err) => {
      if (err) console.error('Lỗi restart:', err);
      process.exit();
    });
  }

  // .help
  if (command === 'help') {
    message.channel.send(\`\\`\\`\\`
🔥⭐ Selfbot custom ⭐🔥
• .spam <file.txt>       - Spam nội dung từ file
• .stopspam              - Dừng spam đang chạy
• .ping                  - Kiểm tra độ trễ
• .kiss @user            - Hôn người dùng
• .dam @user             - Đấm người dùng
• .gid [@user|sv|channel]- Lấy ID người dùng, server hoặc kênh
• .restart               - Khởi động lại bot
• .help                  - Hiển thị tất cả lệnh
Dev: mtruong07_
\\`\\`\\`);
  }
});

// ==== Đăng nhập bot ====
client.login(TOKEN);
