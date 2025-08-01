const blacklistedTokens = new Set();

export function addTokenToBlacklist(token) {
  blacklistedTokens.add(token);
}

export function isTokenBlacklisted(token) {
  return blacklistedTokens.has(token);
}