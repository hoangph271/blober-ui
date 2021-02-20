export type OptionalClassname = {
  className?: string,
}
export type ArrayResponse<T> = {
  itemCount: number,
  items: T[],
}

export type Pic = {
  _id: string,
  title: string,
  blobId: string,
}
export type Album = {
  _id: string,
  title: string,
  pics: Pic[]
}

export type FSItem = {
  _id: string
  path: string
  fullPath: string
  mime?: string
  size?: number
  isDir: boolean
  children?: FSItem[]
}
