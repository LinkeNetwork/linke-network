import Image from '../../component/Image'
import memberImage1 from '../../assets/images/member1.png'
import memberImage2 from '../../assets/images/member2.png'
import memberImage3 from '../../assets/images/member3.png'
import styled from "styled-components"
import intl from "react-intl-universal";
export default function Member() {
  const memberList = [
    {
      avatar: memberImage1,
      name: intl.get('MemberName1'),
      post: intl.get('MemberPost1'),
      introduction: intl.get('MemberIntroduction1')
    },
    {
      avatar: memberImage2,
      name: intl.get('MemberName2'),
      post: intl.get('MemberPost2'),
      introduction: intl.get('MemberIntroduction2')
    },
    {
      avatar: memberImage3,
      name: intl.get('MemberName3'),
      post: intl.get('MemberPost3'),
      introduction: intl.get('MemberIntroduction3')
    }
  ]
  return (
    <MemberContanier>
      <div className="title">{intl.get('MemberTitle')}</div>
      {
        memberList.map((item, index) => {
          return (
            <div className="member-list" key={index}>
            <div className="avatar">
              <Image src={item.avatar} size={288}/>
            </div>
            <div className="member-info">
            <div className="name">
              {item.name}
            </div>
            <div className="post">{item.post}</div>
            <div className="introduction">{item.introduction}</div>
            </div>
          </div>
          )
        })
      }
     
    </MemberContanier>
  )
}
const MemberContanier = styled.div`
width: 80%;
margin: 0 auto;
min-width: 1170px;
.title {
  margin: 114px 0 44px;
  text-align: center;
  font-size: 40px;
  font-weight: bold;
}
.member-list{
  display: flex;
}
.member-info {
  color: #231815;
}
.avatar {
  margin: 0 100px 122px 0;
}
.name {
  font-size: 32px;
  font-weight: bold;
}
.post {
  font-size: 26px;
  font-weight: bold;
}
.introduction{
  font-size: 22px;
  margin-top: 30px;
  color: #666;
}
`