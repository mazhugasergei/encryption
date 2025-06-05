"use client"

import sampleImageSrc from "@/assets/images/sample.jpg"
import { Container } from "@/components/container"
import { DragToScrollString } from "@/components/drag-to-scroll-string"
import { Loader } from "@/components/loader"
import { PasswordInput } from "@/components/password-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Wrapper } from "@/components/wrapper"
import { handleError, imageToBase64 } from "@/utils"
import { decryptData, encryptData, getMasterKeyBase64 } from "@/utils/crypto"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

type FormData = {
	email: string
	password: string
	recoveryMasterKey: string
}

export default function Home() {
	const {
		control,
		handleSubmit,
		watch,
		formState: { isSubmitting },
	} = useForm<FormData>({
		defaultValues: {
			email: "myemail@example.com",
			password: "strongpassword",
			recoveryMasterKey: "",
		},
	})

	const email = watch("email")
	const password = watch("password")
	const recoveryMasterKey = watch("recoveryMasterKey")

	const [data, setData] = useState<string>("")
	const [masterKey, setMasterKey] = useState<string>("")
	const [isEncrypted, setIsEncrypted] = useState(false)

	useEffect(() => {
		imageToBase64(sampleImageSrc).then(setData).catch(handleError)
		getMasterKeyBase64(email, password).then(setMasterKey).catch(handleError)
	}, [])

	const handleEncrypt = async () => {
		if (!data) return
		const encrypted = await encryptData({
			email,
			password,
			data,
		}).catch(handleError)
		if (!encrypted) return
		setData(encrypted)
		setIsEncrypted(true)
	}

	const handleDecrypt = async () => {
		if (!data) return
		const decrypted = await decryptData({
			email,
			password,
			data,
			recoveryMasterKey,
		}).catch(handleError)
		if (!decrypted) return
		setData(decrypted)
		setIsEncrypted(false)
	}

	const onSubmit = async (data: FormData) => {
		if (isEncrypted) await handleDecrypt()
		else await handleEncrypt()
	}

	return (
		<main>
			<Wrapper>
				<form onSubmit={handleSubmit(onSubmit)} className="my-4 space-y-4 p-4">
					<Container>
						{/* Image */}
						{!isEncrypted && (
							<Image
								src={sampleImageSrc}
								alt="Sample Image"
								width={500}
								height={500}
								placeholder="blur"
								className="h-auto w-full rounded-t-md"
								style={{ aspectRatio: sampleImageSrc.width / sampleImageSrc.height }}
							/>
						)}

						{/* Placeholder */}
						{isEncrypted && (
							<div
								className="flex items-center justify-center border-b"
								style={{ aspectRatio: sampleImageSrc.width / sampleImageSrc.height }}
							>
								<p className="text-muted-foreground text-3xl font-medium">?</p>
							</div>
						)}

						{/* Data */}
						<Table>
							<TableBody>
								<TableRow className="!bg-transparent">
									<TableCell className="font-semibold">Data</TableCell>
									<TableCell className="w-full">
										<DragToScrollString data={data.substring(0, 80) + "..."} />
									</TableCell>
									<TableCell>
										<Button type="submit" disabled={isSubmitting}>
											{isSubmitting ? <Loader /> : isEncrypted ? "Decrypt" : "Encrypt"}
										</Button>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</Container>

					{/* Credentials */}
					<Container>
						<Table>
							<TableBody>
								<TableRow className="!bg-transparent">
									<TableCell className="font-semibold">
										<p>Email</p>
									</TableCell>
									<TableCell className="w-full">
										<Controller
											name="email"
											control={control}
											rules={{ required: true }}
											render={({ field }) => <Input {...field} type="email" />}
										/>
									</TableCell>
								</TableRow>
								<TableRow className="!bg-transparent">
									<TableCell className="font-semibold">
										<p>Password</p>
									</TableCell>
									<TableCell className="w-full">
										<Controller
											name="password"
											control={control}
											render={({ field }) => (
												<PasswordInput {...field} disabled={isEncrypted && !!recoveryMasterKey.length} />
											)}
										/>
									</TableCell>
								</TableRow>
								<TableRow className="!bg-transparent">
									<TableCell className="font-semibold">
										<p>Recovery string</p>
										<p className="text-muted-foreground text-xs">(if forgot password)</p>
									</TableCell>
									<TableCell className="w-full">
										<DragToScrollString data={masterKey} showCopyButton />
									</TableCell>
								</TableRow>
								<TableRow className="!bg-transparent">
									<TableCell className="font-semibold">
										<p>Use recovery string</p>
										<p className="text-muted-foreground text-xs">(only for decrypt)</p>
									</TableCell>
									<TableCell className="w-full">
										<Controller
											name="recoveryMasterKey"
											control={control}
											render={({ field }) => <Input {...field} disabled={!isEncrypted} />}
										/>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</Container>
				</form>
			</Wrapper>
		</main>
	)
}
