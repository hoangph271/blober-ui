export const basename = (itemPath: string) => {
  if (itemPath.startsWith('/')) {
    return itemPath.split('/').pop() || itemPath
  }

  return itemPath.split('\\').pop() || itemPath
}
