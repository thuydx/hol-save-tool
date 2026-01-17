export function buildFamilyTitle(
  coordinates: string | undefined,
  name: string,
  t: any,
) {
  if (!coordinates) return name

  const place = t.place_name?.[coordinates] ?? ''
  const clan = t.clan_name.replace('{name}', name)

  return place ? `${place} ${clan}` : clan
}

