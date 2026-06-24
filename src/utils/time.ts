/** Current wall-clock time formatted HH:MM:SS — used for live audit/event stamps. */
export function nowStamp(): string {
  const d = new Date()
  return d.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/** Short HH:MM for timeline rows. */
export function nowShort(): string {
  const d = new Date()
  return d.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  })
}
