import { compressSync, decompressSync, strFromU8, strToU8 } from 'fflate'
import { decrypt, encrypt } from '../helpers/crypto.js'

export async function encryptDatabase(database, password) {
    const strDatabase = JSON.stringify(database)

    const compressed = compressSync(strToU8(strDatabase))

    console.debug(
        'Compress from',
        strDatabase.length,
        'to',
        compressed.byteLength
    )

    return await encrypt(compressed, password)
}

// data: ArrayBuffer
export async function decryptDatabase(data, password) {
    if (data instanceof ArrayBuffer) {
        data = new Uint8Array(data)
    }

    if (!data || !data.length) {
        console.error('Empty file')
        return null
    }

    const decrypted = await decrypt(data, password)
    if (!decrypted) {
        console.error('Decryption failed')
        return null
    }

    let decompressed = null
    try {
        decompressed = decompressSync(decrypted)
    } catch (error) {
        console.error('Decompression failed')
        return null
    }

    if (!decompressed || !decompressed.length) {
        console.error('Decompression failed')
        return null
    }

    try {
        const database = JSON.parse(strFromU8(decompressed))
        if (!database.accounts || !database.folders) {
            return null
        }
        return database
    } catch {
        console.error('Not a JSON file')
        return
    }
}
