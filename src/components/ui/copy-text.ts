// src/components/ui/copy-text.ts
/**
 * Copies text with the async Clipboard API, falling back to execCommand on insecure origins.
 */
export async function copyText(text: string): Promise<boolean> {
	try {
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(text);
			return true;
		}
	} catch {
		// Why: Permission denied in iframe or restricted origin falls through to the legacy textarea copy path.
	}
	try {
		const area = document.createElement("textarea");
		area.value = text;
		area.setAttribute("readonly", "");
		area.style.position = "fixed";
		area.style.opacity = "0";
		document.body.appendChild(area);
		area.select();
		const successful = document.execCommand("copy");
		document.body.removeChild(area);
		return successful;
	} catch {
		return false;
	}
}
