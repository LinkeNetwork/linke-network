export default function SearchChat() {
  return (
    <div className='chat-search'>
      <div className="position-relative">
        <span className="icon-search-wrapper">
          <i className="iconfont icon-search"></i>
        </span>
        <input className="form-control search-input" type="search" placeholder="Search..." aria-label="Search..." />
      </div>
    </div>
  )
}