export function isNotEmpty(value: string) {
  if (!value || value.trim() === '') {
    return false;
  }
  return true;
}
