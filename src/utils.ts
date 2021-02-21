import { API_ROOT } from './constants'
import { FSItem } from './interfaces'

export const basename = (fullPath: string) => {
  if (fullPath.startsWith('/')) {
    return fullPath.split('/').pop() || fullPath
  }

  return fullPath.split('\\').pop() || fullPath
}

const _getGenericPreviewFile = (fsItem: FSItem) => {
  if (fsItem.mime) {
    switch (true) {
      case fsItem.mime.startsWith('video/'):
        return 'video.svg'
      case fsItem.mime === 'application/pdf':
        return 'file-pdf.svg'
    }
  }

  return 'file-binary.svg'
}
const _getGenericPreviewUrl = (fsItem: FSItem) => `/icons/${_getGenericPreviewFile(fsItem)}`
const _getPreviewUrl = (_id: string) => `${API_ROOT}/files/preview/${_id}`

export const getPreviewUrls = (fsItem: FSItem) => {
  if (fsItem.isDir) {
    return ['/icons/folder.svg']
  }

  return [
    _getPreviewUrl(fsItem._id),
    _getGenericPreviewUrl(fsItem)
  ]
}
export const getRawUrl = (_id: string) => `${API_ROOT}/files/raw/${_id}`

const str2ab = (inStr: string) => new Blob([inStr], { type: 'text/plain' }).arrayBuffer()
const hexEncode = (buffer: ArrayBuffer) => {
  return Array.prototype.map.call(new Uint8Array(buffer), (byte) => {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2)
  }).join('')
}
export const hash = async (inStr: string) => {
  const buffer = await window.crypto.subtle.digest('SHA-256', await str2ab(inStr))
  return hexEncode(buffer)
}

export const noOp = () => {}
