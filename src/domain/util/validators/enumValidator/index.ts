export function isValidEnumValue(value: string, enumType: Record<string, string>): boolean {
  const enumValues: string[] = Object.values(enumType);
  return enumValues.includes(value);
}
