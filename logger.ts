import fs from 'fs-extra'
import path from 'path'
//Date utilitys
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'

const scriptDirectory = __dirname

export function currentDate(): string { 
    //Get current date and time
    const now = new Date()

    //Apply custom format
    const customFormat = `M/d/yyyy ' - ' h:mm:ss a 'EST'`

    //Format the current date and time
    const formattedDate = format(now, customFormat, { locale: enUS })

    // console.log("Got date: " + formattedDate)

    return formattedDate
}

export async function logWarn(message: string) {
    const logMessage = 'WARN | ' + currentDate() + ' | ' + message
    writeLogToFile(logMessage)
}

export async function logError(message: string, errorJSON: any) {
    const logMessage = 'ERROR | ' + currentDate() + ' | ' + message + '\n' + JSON.stringify(errorJSON)
    writeLogToFile(logMessage)
}

export async function log(message: string) {
    const logMessage = 'GOOD  | ' + currentDate() + ' | ' + message
    writeLogToFile(logMessage)
}

async function writeLogToFile(logMessage: string) {
    const logFilePath = path.join(scriptDirectory, './log.txt')
    try {
        await fs.appendFile(logFilePath, '\n' + logMessage)
        console.log(logMessage)
    } catch (err) {
        console.error('Failed to write to log file:', err)
    }
}