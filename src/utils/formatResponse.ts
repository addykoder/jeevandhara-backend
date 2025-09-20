// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resp(payload: any) {
	return { status: 'ok', payload };
}

export function err(message: string) {
	return { status: 'error', message, payload: {} };
}

export function msg(message: string) {
	return { status: 'ok', message, payload: {} };
}

export const unexpectedError = {
	status: 'error',
	message: 'Something broke on the server side',
	payload: {},
};
