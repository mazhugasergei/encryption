import { createCipheriv, createDecipheriv, pbkdf2, randomBytes } from "crypto"
import { promisify } from "util"

const pbkdf2Async = promisify(pbkdf2)

async function deriveMasterKey(email: string, password: string): Promise<Buffer> {
	const salt = Buffer.from(email, "utf8")
	return await pbkdf2Async(password, salt, 100000, 32, "sha256")
}

export async function getMasterKeyBase64(email: string, password: string): Promise<string> {
	const masterKey = await deriveMasterKey(email, password)
	return masterKey.toString("base64")
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
	recoveryMasterKey: masterKeyBase64,
	data,
}: {
	email: string
	data: string
	password?: string
	recoveryMasterKey?: string
}): Promise<string> {
	let masterKey: Buffer
	if (masterKeyBase64) {
		masterKey = Buffer.from(masterKeyBase64, "base64")
	} else if (password) {
		masterKey = await deriveMasterKey(email, password)
	} else {
		throw new Error("Either password or masterKeyBase64 must be provided")
	}
	return decryptWithMasterKey(masterKey, data)
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

export async function exportMasterKey(email: string, password: string): Promise<string> {
	const masterKey = await deriveMasterKey(email, password)
	return masterKey.toString("base64")
}
