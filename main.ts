import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE: string =
  "Tip: your agent summarized three hours of debugging into a single bullet point. It's wrong, but it fits the context window — and your standup starts in five minutes.";

const outputDir: string = process.env.OUTPUT_DIR ?? "/output";

// Validate: 1-200 characters, a single line, and not only whitespace.
const charCount: number = [...LINE].length;
if (charCount < 1 || charCount > 200) {
  throw new Error(`Entry must be 1-200 characters, got ${charCount}.`);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("Entry must be a single line.");
}
if (LINE.trim().length === 0) {
  throw new Error("Entry must not be only whitespace.");
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), LINE, "utf8");

// Read-back: the file on disk must be byte-identical to the entry line,
// so a partial write or stray newline can never slip through silently.
// Compare bytes, not just the decoded string, so an encoding slip that
// decodes back to the same string still fails loudly.
const written: Buffer = readFileSync(join(outputDir, "entry.txt"));
if (!written.equals(Buffer.from(LINE, "utf8"))) {
  throw new Error("entry.txt on disk does not match the entry line.");
}

const byteCount: number = Buffer.byteLength(LINE, "utf8");
console.log(`Characters: ${charCount} (${byteCount} bytes)`);
console.log(LINE);
