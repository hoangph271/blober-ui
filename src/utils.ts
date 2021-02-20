export const basename = (fullPath: string) => {
  if (fullPath.startsWith('/')) {
    return fullPath.split('/').pop() || fullPath
  }

  return fullPath.split('\\').pop() || fullPath
}
