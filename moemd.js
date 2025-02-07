// main.js

const settings = require('./settings');
const { loadCommands } = require('./utils');
require('./config.js');
const { isBanned } = require('./lib/isBanned');
const yts = require('youtube-yts');
const { fetchBuffer } = require('./lib/myfunc');
const ytdl = require('./lib/ytdl2');
const fs = require('fs');
const fetch = require('node-fetch');
const autostatusview = require('./commands/autostatusview');

// Command imports
const tagAllCommand = require('./commands/tagall');
const helpCommand = require('./commands/help');
const banCommand = require('./commands/ban');
const { promoteCommand } = require('./commands/promote');
const { demoteCommand } = require('./commands/demote');
const muteCommand = require('./commands/mute');
const unmuteCommand = require('./commands/unmute');
const stickerCommand = require('./commands/sticker');
const isAdmin = require('./helpers/isAdmin');
const warnCommand = require('./commands/warn');
const warningsCommand = require('./commands/warnings');
const ttsCommand = require('./commands/tts');
const { tictactoeCommand, handleTicTacToeMove } = require('./commands/tictactoe');
const { incrementMessageCount, topMembers } = require('./commands/topmembers');
const ownerCommand = require('./commands/owner');
const deleteCommand = require('./commands/delete');
const { handleAntilinkCommand, handleLinkDetection } = require('./commands/antilink');
const { Antilink } = require('./lib/antilink');
const memeCommand = require('./commands/meme');
const tagCommand = require('./commands/tag');
const jokeCommand = require('./commands/joke');
const quoteCommand = require('./commands/quote');
const factCommand = require('./commands/fact');
const weatherCommand = require('./commands/weather');
const newsCommand = require('./commands/news');
const kickCommand = require('./commands/kick');
const simageCommand = require('./commands/simage');
const attpCommand = require('./commands/attp');
const { startHangman, guessLetter } = require('./commands/hangman');
const { startTrivia, answerTrivia } = require('./commands/trivia');
const { complimentCommand } = require('./commands/compliment');
const { insultCommand } = require('./commands/insult');
const { eightBallCommand } = require('./commands/eightball');
const { lyricsCommand } = require('./commands/lyrics');
const { dareCommand } = require('./commands/dare');
const { truthCommand } = require('./commands/truth');
const { clearCommand } = require('./commands/clear');
const pingCommand = require('./commands/ping');
const aliveCommand = require('./commands/alive');
const blurCommand = require('./commands/img-blur');
const welcomeCommand = require('./commands/welcome');
const goodbyeCommand = require('./commands/goodbye');
const githubCommand = require('./commands/github');
const { handleAntiBadwordCommand, handleBadwordDetection } = require('./lib/antibadword');
const antibadwordCommand = require('./commands/antibadword');
const { handleChatbotCommand, handleChatbotResponse } = require('./commands/chatbot');
const takeCommand = require('./commands/take');
const { flirtCommand } = require('./commands/flirt');
const characterCommand = require('./commands/character');
const wastedCommand = require('./commands/wasted');
const shipCommand = require('./commands/ship');
const groupInfoCommand = require('./commands/groupinfo');
const resetlinkCommand = require('./commands/resetlink');
const staffCommand = require('./commands/staff');
const unbanCommand = require('./commands/unban');
const emojimixCommand = require('./commands/emojimix');
const { handlePromotionEvent } = require('./commands/promote');
const { handleDemotionEvent } = require('./commands/demote');
const viewOnceCommand = require('./commands/viewonce');

// **** ADD MENU COMMAND IMPORT ****
const menuCommand = require('./commands/menu');

// Global settings
global.packname = settings.packname;
global.author = settings.author;
global.channelLink = "https://wa.me/message/HEYNTN2KD6K7O1";
global.ytch = "MOE VIPPEER";

// Global channel configuration
const channelInfo = {
    contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363161513685998@newsletter',
            newsletterName: 'MOEBOT-MD',
            serverMessageId: -1
        }
    }
};

async function handleMessages(sock, messageUpdate, printLog) {
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;

        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');

        let userMessage = message.message?.conversation?.trim().toLowerCase() ||
            message.message?.extendedTextMessage?.text?.trim().toLowerCase() || '';
        userMessage = userMessage.replace(/\.\s+/g, '.').trim();

        // (Additional processing like ban check, game moves, etc.)

        // Command handlers
        switch (true) {
            // Example command cases...
            case userMessage === '.menu':
                await menuCommand(sock, chatId);
                break;
            
            // Other command cases go here
            
            default:
                if (isGroup) {
                    if (userMessage) {
                        await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                    }
                    await Antilink(message, sock);
                    await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
                }
                break;
        }
    } catch (error) {
        console.error('Error in message handler:', error);
        if (chatId) {
            await sock.sendMessage(chatId, { text: '❌ Failed to process command!', ...channelInfo });
        }
    }
}

module.exports = { 
    handleMessages,
    handleGroupParticipantUpdate: async (sock, update) => {
        const { id, participants, action, author } = update;
        console.log('Group Update in Main:', { id, participants, action, author });
        if (action === 'promote') {
            await handlePromotionEvent(sock, id, participants, author);
        } else if (action === 'demote') {
            await handleDemotionEvent(sock, id, participants, author);
        }
    }
};
