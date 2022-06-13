import FindUs from '../home/FindUs'
export default function ContentInfo() {
  return (
    <div className="content-info-wrap">
      <div className="titile-wrap">
        <div className="title">What can Linke Network do?</div>
        <div className="sub-title">The protocol is built with modularity in mind, allowing new features to be added while ensuring that the content and social relationships that users have are immutable.</div>
      </div>
      <div className="more-wrap">
        <div className="more-btn"></div>
        <div className="more-info">
          <FindUs type={'menu'}></FindUs>
        </div>
      </div>
    </div>
  )
}