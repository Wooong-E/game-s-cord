import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../page/MyPage/Sidebar";
import "../css/RequestReceived.css";
import Sidebar from "../page/MyPage/Sidebar";
import styles from ".././page/MyPage/MyPage.module.css";

// API 호출 기본 URL 설정
const BASE_URL = "/api/matches";

// API 호출을 위한 헬퍼 함수
const updateMatchStatus = async (matchId, action) => {
  const url = `${BASE_URL}/${matchId}/${action}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // 중요: 실제 환경에서는 인증 토큰을 헤더에 추가해야 합니다.
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(
          errorData.message || `API 요청 실패: ${response.status}`
        );
      } catch {
        throw new Error(`API 요청 실패: ${response.status} - ${errorText}`);
      }
    }

    // 성공 응답 (MatchResponseDTO, 즉 orders DTO) 반환
    return await response.json();
  } catch (error) {
    console.error(`매칭 ${action} 실패:`, error);
    alert(`매칭 처리 중 오류 발생: ${error.message}`);
    throw error;
  }
};

export default function RequestReceived() {
  const [activeTab, setActiveTab] = useState("request");
  const [receivedList, setReceivedList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // [데이터 로딩]: 컴포넌트 마운트 시 받은 매칭 목록 조회
  useEffect(() => {
    const fetchReceivedMatches = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/received`, {
          headers: {
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        if (!response.ok) throw new Error("받은 매칭 목록 조회 실패");

        let data = await response.json();

        // 닉네임 필드가 서버 응답에 없으므로 임시로 추가 (실제로는 백엔드 DTO 수정 필요)
        // usersId는 요청을 보낸 사용자 (매칭을 요청한 사람)의 ID입니다.
        // 이 예시에서는 ordersId를 사용하여 임시 닉네임을 생성합니다.
        data = data.map((item) => ({
          ...item,
          //  임시 닉네임 설정: 서버 응답 DTO에 닉네임 필드가 추가되면 이 로직을 제거해야 합니다.
          nickname: `USER-${item.usersId}`,
        }));

        setReceivedList(data);
      } catch (error) {
        console.error("데이터 로딩 중 오류:", error);
        // alert("매칭 요청 목록을 가져오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceivedMatches();
  }, []);

  // [받은 요청 처리]: 수락 또는 거절로 상태 변경 (PATCH 연동)
  const handleDecision = async (ordersId, decision) => {
    const action = decision === "accepted" ? "accept" : "decline";

    try {
      //  ordersId를 사용하여 API 호출
      const updatedMatch = await updateMatchStatus(ordersId, action);

      // API 호출 성공 시에만 로컬 상태 업데이트
      setReceivedList((prev) =>
        prev.map((item) =>
          //  ordersId를 기준으로 항목 식별
          item.ordersId === ordersId
            ? { ...item, orderStatus: updatedMatch.orderStatus }
            : item
        )
      );

      alert(`${action === "accept" ? "수락" : "거절"} 처리되었습니다.`);

      // 처리 완료 탭으로 이동 (선택 사항)
      setActiveTab("processed");
    } catch (error) {
      // updateMatchStatus 내부에서 에러 처리됨
    }
  };

  // 탭에 따라 리스트 필터링
  const filteredRequests = receivedList.filter((item) => {
    // 백엔드 Enum 값 (대문자) 사용을 가정
    if (activeTab === "request") {
      return item.orderStatus === "WAITING";
    } else if (activeTab === "processed") {
      return item.orderStatus === "ACCEPTED" || item.orderStatus === "REJECTED";
    }
    return false;
  });

  // 상태에 따른 닷 클래스 결정
  const getStatusDotClass = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "status-dot--accepted";
      case "REJECTED":
        return "status-dot--rejected";
      case "WAITING":
      default:
        return "status-dot--pending";
    }
  };

  return (
    // ⭐️ CoinRecharge와 동일한 styles.wrapper 사용
    <div className={styles.wrapper}>
      <Sidebar />

      {/* ⭐️ CoinRecharge와 동일하게 flex: 1 스타일 적용 */}
      <section
        className="request-content"
        style={{ flex: 1, marginRight: "80px", minHeight: "500px" }}
      >
        {/* ⭐️ Link to /requestdetail 대신, /mypage/requestdetail 로 경로를 확인해주세요. */}
        <Link to="/requestdetail" className="request-title">
          신청내역
        </Link>
        <Link to="/requestReceived" className="request-title">
          받은내역
        </Link>
        <div className="request-tabs">
          <button
            className={
              "request-tab" +
              (activeTab === "request" ? " request-tab--active" : "")
            }
            onClick={() => setActiveTab("request")}
          >
            매칭요청
          </button>
          <button
            className={
              "request-tab" +
              (activeTab === "processed" ? " request-tab--active" : "")
            }
            onClick={() => setActiveTab("processed")}
          >
            매칭수락
          </button>
        </div>

        {activeTab === "processed" && (
          <div className="status-legend">
            <span>
              <span className="status-dot status-dot--accepted" /> 수락됨
            </span>
            <span>
              <span className="status-dot status-dot--rejected" /> 거절됨
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="loading-state">매칭 요청을 불러오는 중...</div>
        ) : (
          <ul className="request-list">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((item) => (
                // ordersId를 key로 사용
                <li key={item.ordersId} className="request-row">
                  <div className="request-row-left">
                    <span className="request-row-title">
                      {/* 임시 닉네임 사용 */}
                      {item.nickname} 님의 매칭요청
                    </span>
                  </div>

                  <div className="request-row-right">
                    {activeTab === "request" ? (
                      // 1. 처리 대기 탭: 수락/거절 버튼 표시
                      <>
                        <button
                          className={"pill-button pill-button--accept"}
                          // ordersId 전달
                          onClick={() =>
                            handleDecision(item.ordersId, "accepted")
                          }
                        >
                          수락
                        </button>
                        <button
                          className={"pill-button pill-button--reject"}
                          // ordersId 전달
                          onClick={() =>
                            handleDecision(item.ordersId, "rejected")
                          }
                        >
                          거절
                        </button>
                      </>
                    ) : (
                      // 2. 처리 완료 탭: 처리 상태 표시 및 상대 정보 확인 버튼
                      <>
                        <span className="request-row-status-label">
                          처리상태 :
                        </span>
                        <span
                          className={
                            // orderStatus 사용
                            "status-dot " + getStatusDotClass(item.orderStatus)
                          }
                        />
                        <button
                          className="info-button"
                          // orderStatus 사용
                          disabled={item.orderStatus === "REJECTED"}
                        >
                          상대 정보 확인하기
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <div className="no-requests">
                {activeTab === "request"
                  ? "새로운 매칭 요청이 없습니다."
                  : "처리 완료된 매칭 내역이 없습니다."}
              </div>
            )}
          </ul>
        )}
      </section>
    </div>
  );
}
