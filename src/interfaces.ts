export type OptionalClassname = {
  className?: string,
}
export type ListResponseWithCount<T> = {
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