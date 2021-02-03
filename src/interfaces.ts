export type OptionalClassname = {
  className?: string,
}
export type ArrayResponse<T> = {
  itemCount: number,
  items: T[],
}

type Pic = {
  _id: string,
  title: string,
  blobId: string,
}
export type Album = {
  _id: string,
  title: string,
  pics: Pic[]
}