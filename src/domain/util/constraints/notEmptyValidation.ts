export function isNotEmpty({ value }: { value: string }) {
  if (!value || value.trim() === '') {
    return false;
  }
  return true;
}
