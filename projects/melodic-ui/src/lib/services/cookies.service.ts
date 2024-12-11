type CookieOptions = {
	expires?: Date;
	path?: string;
	domain?: string;
	maxAge?: number;
	secure?: boolean;
	httpOnly?: boolean;
	sameSite?: 'Strict' | 'Lax' | 'None';
};

const set = (name: string, value: string, options?: CookieOptions): void => {
	const cookieParts: string[] = [];

	cookieParts.push(`${name}=${value}`);

	if (options?.expires) {
		cookieParts.push(`expires=${options.expires.toUTCString()}`);
	}

	cookieParts.push(`path=${options?.path || '/'}`);

	if (options?.domain) {
		cookieParts.push(`domain=${options.domain}`);
	}

	if (options?.maxAge) {
		cookieParts.push(`max-age=${options.maxAge}`);
	}

	if (options?.secure) {
		cookieParts.push('Secure');
	}

	if (options?.httpOnly) {
		cookieParts.push('HttpOnly');
	}

	if (options?.sameSite) {
		cookieParts.push(`SameSite=${options.sameSite}`);
	}

	document.cookie = cookieParts.join('; ');
};

const get = (name: string): string | null => {
	const nameEQ = name + '=';
	const cookies = document.cookie.split(';');

	for (let i = 0; i < cookies.length; i++) {
		let cookie = cookies[i].trim();

		if (cookie.indexOf(nameEQ) === 0) {
			return cookie.substring(nameEQ.length, cookie.length);
		}
	}

	return null;
};

const remove = (name: string, options?: CookieOptions): void => {
	const cookieOptions: CookieOptions = { ...options, expires: new Date(0) };
	set(name, '', cookieOptions);
};

const clear = (): void => {
	const cookies = document.cookie.split(';');
	cookies.forEach((cookie) => {
		const eqPos = cookie.indexOf('=');
		const cookieName = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
		remove(cookieName.trim());
	});
};

export const Cookies = {
	get,
	set,
	remove,
	clear
};
