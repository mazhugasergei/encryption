import { createCipheriv, createDecipheriv, pbkdf2, randomBytes } from "crypto"
import { promisify } from "util"

const pbkdf2Async = promisify(pbkdf2)

async function deriveMasterKey(email: string, password: string): Promise<Buffer> {
	const salt = Buffer.from(email, "utf8")
	return await pbkdf2Async(password, salt, 100000, 32, "sha256")
}

async function deriveRecoveryKey(email: string, recoverySecret: string): Promise<Buffer> {
	const salt = Buffer.from(email, "utf8")
	return await pbkdf2Async(recoverySecret, salt, 100000, 32, "sha256")
}

export async function encryptData({
	email,
	password,
	data,
}: {
	email: string
	password: string
	data: string
}): Promise<string> {
	const masterKey = await deriveMasterKey(email, password)
	const iv = randomBytes(16)
	const cipher = createCipheriv("aes-256-cbc", masterKey, iv)
	let encrypted = cipher.update(data, "utf8")
	encrypted = Buffer.concat([encrypted, cipher.final()])
	return Buffer.concat([iv, encrypted]).toString("base64")
}

export async function decryptData({
	email,
	password,
	data,
	recoveryString,
}: {
	email: string
	password?: string
	data: string
	recoveryString?: string
}): Promise<string> {
	const masterKey = recoveryString
		? await recoverMasterKey(email, recoveryString)
		: await deriveMasterKey(email, password ?? "")

	return decryptWithMasterKey(masterKey, data)
}

export async function createRecoveryString(email: string, password: string): Promise<string> {
	const masterKey = await deriveMasterKey(email, password)
	const recoverySecret = randomBytes(32)
	const recoveryKey = await deriveRecoveryKey(email, recoverySecret.toString("base64"))
	const iv = randomBytes(16)
	const cipher = createCipheriv("aes-256-cbc", recoveryKey, iv)
	let encryptedKey = cipher.update(masterKey)
	encryptedKey = Buffer.concat([encryptedKey, cipher.final()])
	const combined = Buffer.concat([recoverySecret, iv, encryptedKey])
	return combined.toString("base64")
}

export async function recoverMasterKey(email: string, combinedRecoveryString: string): Promise<Buffer> {
	const data = Buffer.from(combinedRecoveryString, "base64")
	const recoverySecret = data.slice(0, 32).toString("base64")
	const iv = data.slice(32, 48)
	const encrypted = data.slice(48)
	const recoveryKey = await deriveRecoveryKey(email, recoverySecret)
	const decipher = createDecipheriv("aes-256-cbc", recoveryKey, iv)
	let decrypted = decipher.update(encrypted)
	decrypted = Buffer.concat([decrypted, decipher.final()])
	return decrypted
}

export function decryptWithMasterKey(masterKey: Buffer, secret: string): string {
	const data = Buffer.from(secret, "base64")
	const iv = data.slice(0, 16)
	const encrypted = data.slice(16)
	const decipher = createDecipheriv("aes-256-cbc", masterKey, iv)
	let decrypted = decipher.update(encrypted)
	decrypted = Buffer.concat([decrypted, decipher.final()])
	return decrypted.toString("utf8")
}
