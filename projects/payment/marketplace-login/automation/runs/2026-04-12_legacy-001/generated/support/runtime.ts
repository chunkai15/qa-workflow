import fs from "node:fs";
import path from "node:path";

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} must be set for runtime execution.`);
  }
  return value;
}

export function randomAlphaNumeric(length: number): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let output = "";
  while (output.length < length) {
    output += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return output.slice(0, length);
}

export function buildPackageName(): string {
  const prefix = "marketplace-auto-";
  return `${prefix}${randomAlphaNumeric(90 - prefix.length)}`;
}

export function buildHeadline(): string {
  return `Marketplace package ${randomAlphaNumeric(12)}`;
}

export function buildDescription(): string {
  return `Automated QA marketplace package ${randomAlphaNumeric(16)} created to validate login, package setup, pricing, and publish readiness.`;
}

export function resolveUploadFixtureFromEnv(): string {
  const target = requireEnv("MARKETPLACE_UPLOAD_DIR");
  const stats = fs.statSync(target);

  if (stats.isFile()) {
    return target;
  }

  const candidates = fs
    .readdirSync(target)
    .filter((entry) => /\.(png|jpe?g)$/i.test(entry));

  if (!candidates.length) {
    throw new Error(`No image fixture found in ${target}.`);
  }

  const candidate = candidates[Math.floor(Math.random() * candidates.length)];
  return path.join(target, candidate);
}
