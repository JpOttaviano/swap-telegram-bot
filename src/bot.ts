import dotenv from 'dotenv'
import TelegramBot from 'node-telegram-bot-api'
import { startWatch } from './modules/pancake'
import schedule from 'node-schedule'

let job

dotenv.config()

const { TELEGRAM_BOT_TOKEN = '' , PORT = '', HOST = ''} = process.env

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true ,webHook: {port: PORT, host: HOST}})

bot.onText(/trade/, async (msg) => {
  job = schedule.scheduleJob('*/3 * * * *', async () => {
    console.log('job triggered')
    const result = await startWatch('TRADE-BNB')
    console.log(`APR is: ${result}`)
    if (result < 400) {
      bot.sendMessage(msg.chat.id, ` APR is below 400: APR ${result.toString()}%`)
    }
  })
  bot.sendMessage(msg.chat.id, `TRADE-BNB watch job scheduled every 3mins`)
  console.log('Watch job scheduled every 58s')
})

bot.onText(/stop/, (msg) => {
  if (job) {
    job.cancel()
    bot.sendMessage(msg.chat.id, 'Turnef off')
    console.log('Job canceled.')
  }
})

bot.onText(/test/, (msg) => {
  if (job) {
    bot.sendMessage(msg.chat.id, 'Watch job scheduled')
  } else {
    bot.sendMessage(msg.chat.id, 'Bot is off')
  }
})
