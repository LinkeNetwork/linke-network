import intl from "react-intl-universal"
export default function SearchChat(props) {
  const { handleSearch } = props
  return (
    <div className='chat-search'>
      <div className="position-relative">
        <span className="icon-search-wrapper">
          <i className="iconfont icon-search"></i>
        </span>
        <input className="form-control search-input" type="search" placeholder={intl.get('Search')} aria-label="Search..." onInput={handleSearch} />
      </div>
    </div>
  )
}