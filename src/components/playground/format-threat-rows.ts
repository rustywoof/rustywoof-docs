// src/components/playground/format-threat-rows.ts
const MAX_VAL_LEN = 58;
const MAX_DISPLAYED_THREATS = 12;

function padEnd(str: string, len: number): string {
	return str.length >= len ? str.slice(0, len) : `${str}${" ".repeat(len - str.length)}`;
}

/**
 * Splits an array of threat identifiers into wrapped rows fitting the 58-char table cell.
 */
function wrapThreatChunks(threats: readonly string[]): string[] {
	const count = threats.length;
	const isTruncated = count > MAX_DISPLAYED_THREATS;
	const activeList = isTruncated ? threats.slice(0, MAX_DISPLAYED_THREATS) : [...threats];
	const rows: string[] = [];
	let buf = "";

	for (let i = 0; i < activeList.length; i++) {
		const threat = activeList[i] ?? "";
		const hasMore = i < activeList.length - 1 || isTruncated;
		const candidate = buf ? `${buf}, ${threat}` : threat;
		if (candidate.length + (hasMore ? 1 : 0) <= MAX_VAL_LEN) {
			buf = candidate;
		} else {
			if (buf) rows.push(`${buf},`);
			buf = threat;
		}
	}
	if (isTruncated) {
		const suffix = `(+${count - MAX_DISPLAYED_THREATS} more)`;
		if (buf && `${buf}, ${suffix}`.length <= MAX_VAL_LEN) {
			rows.push(`${buf}, ${suffix}`);
		} else {
			if (buf) rows.push(`${buf},`);
			rows.push(suffix);
		}
	} else if (buf) {
		rows.push(buf);
	}
	return rows;
}

/**
 * Formats multi-line threat rows with label on first row and blank label on continuation rows.
 */
export function formatThreatRows(threats: readonly string[]): string[] {
	if (threats.length === 0) {
		return [`│ Threats         │ ${padEnd("None reported", MAX_VAL_LEN)} │`];
	}
	const chunks = wrapThreatChunks(threats);
	return chunks.map((chunk, idx) => {
		const label = idx === 0 ? "Threats        " : "               ";
		return `│ ${label} │ ${padEnd(chunk, MAX_VAL_LEN)} │`;
	});
}
