export function isValidPassword({ password }: { password: string }): boolean {
  if (!password || password.trim() === '' || password.length < 8) {
    return false;
  }
  return true;
}
