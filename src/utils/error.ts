/**
 * Parses an error into a string.
 * @param error - The error to parse.
 * @returns The parsed error.
 */
export function parseError(error: unknown): string {
	if (typeof error === "string") {
		return error;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return "An unknown error occurred";
}
