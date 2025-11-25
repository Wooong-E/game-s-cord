import { Link } from "react-router-dom";

// 충전, 충전 내역 조회를 재사용하기 위한 컴포넌트
const HeaderTabs = () => {
  return (
    <>
      <div className="header-titles">
        <Link to="/coin" className="title-link">
          충전
        </Link>
        <Link to="/coinHistory" className="title-link">
          충전 내역 조회
        </Link>
      </div>
      <hr className="header-titles-hr" />
    </>
  );
};

export default HeaderTabs;
