import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { OptionalClassname } from '../interfaces'

type PageLinkProps = {
  to?: string,
  label: string | number,
  isDisabled?: boolean,
} & OptionalClassname
const PageLink = styled((props: PageLinkProps) => {
  const { to = '', label, className, isDisabled } = props

  return isDisabled ? (
    <button disabled className={[className, label === '...' && 'spacer'].filter(Boolean).join(' ')}>
      {label}
    </button>
  ) : (
    <Link to={to} className={className}>
      {label}
    </Link>
  )
})`
  border: 1px solid gray;
  border-radius: 2px;
  width: 2.2rem;
  height: 2.2rem;
  text-decoration: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: medium;
  box-sizing: border-box;
  color: black;

  &[disabled]:not(.spacer) {
    background-color: gray;
  }

  .spacer {
    cursor: default;
  }
`

const PAGER_LIMIT = 8
type PagerProps = {
  pageCount: number,
  currentPage: number,
  getUrl(page: number): string,
} & OptionalClassname
const Pager = styled((props: PagerProps) => {
  const { currentPage, pageCount, className = '', getUrl } = props

  if (pageCount <= PAGER_LIMIT) {
    const pages = Array.from({ length: pageCount })
      .map((_, i) => i + 1)

    return (
      <div className={className}>
      {pages.map(page => (
        <PageLink
          key={page}
          label={page}
          to={getUrl(page)}
          isDisabled={page === currentPage}
        />
      ))}
      </div>
    )
  }

  const inStart = currentPage < PAGER_LIMIT - 3
  const inEnd = currentPage + (PAGER_LIMIT - 3) >= pageCount

  const startPage = inStart ? 1 : currentPage - (PAGER_LIMIT / 2)
  const betweenPages = inEnd
    ? Array.from({ length: PAGER_LIMIT - 2 }).map((_, i) => pageCount - i - 1).reverse()
    : Array.from({ length: PAGER_LIMIT - 2 }).map((_, i) => i + startPage + 1)

  return (
    <div className={className}>
      <PageLink label="1" to={getUrl(1)} isDisabled={currentPage === 1} />
      {inStart || <PageLink label="..." />}
      {betweenPages.map(page => (
        <PageLink
          key={page}
          label={page}
          to={getUrl(page)}
          isDisabled={page === currentPage}
        />
      ))}
      {inEnd || <PageLink label="..." />}
      <PageLink
        label={pageCount}
        to={getUrl(pageCount)}
        isDisabled={currentPage === pageCount}
      />
    </div>
  )
})`
  display: flex;
  justify-content: center;
  gap: 0.2rem;
  margin: 0.3rem 0;
  flex-wrap: wrap;
`

export { Pager }
