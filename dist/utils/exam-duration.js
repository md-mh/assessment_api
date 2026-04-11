/** Parses stored duration text into seconds for exam timer (default ~20:31). */
export function parseDurationToSeconds(duration) {
    if (duration === null || duration === undefined) {
        return 20 * 60 + 31;
    }
    const t = String(duration).trim();
    if (t === "")
        return 20 * 60 + 31;
    const minMatch = t.match(/^(\d+(?:\.\d+)?)\s*min\b/i);
    if (minMatch) {
        return Math.round(parseFloat(minMatch[1]) * 60);
    }
    const hm = t.match(/^(\d{1,3}):(\d{2})$/);
    if (hm) {
        const mm = parseInt(hm[1], 10);
        const ss = parseInt(hm[2], 10);
        return mm * 60 + ss;
    }
    if (/^\d+$/.test(t)) {
        return parseInt(t, 10) * 60;
    }
    return 20 * 60 + 31;
}
//# sourceMappingURL=exam-duration.js.map