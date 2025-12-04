import React, { useState, useEffect } from "react";
import api from "../api/axios";
import HeaderTabs from "./HeaderTabs";
import PaymentItem from "./PaymentItem";
import "../css/CoinChargeHistory.css";
import Sidebar from "../page/MyPage/Sidebar";
import styles from ".././page/MyPage/MyPage.module.css";

const CoinChargeHistory = () => {
  // 상태: 충전 내역, 로딩 상태, 에러 상태 관리
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 데이터 가져오는 함수
  const fetchCoinHistory = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("로그인 정보가 없습니다. 다시 로그인해 주세요.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get(`/coins/history`);

      const filteredData = response.data.filter((item) => {
        const upperCaseMethod = (item.paymentMethod || "").toUpperCase();

        // 제외할 목록
        const excludedMethods = [
          "GAMEMATE_PAYOUT",
          "MATCH_PENDING",
          "MATCH_CANCELLED",
        ];

        // 제외 목록에 포함되지 않은 경우에만 true 반환 (목록에 남김)
        return !excludedMethods.includes(upperCaseMethod);
      });

      const transformedData = filteredData.map((item, index) => {
        const isRefundable = item.paymentMethod !== "MATCH_PENDING"; // 필터링 후에도 혹시 모를 경우를 대비해 유지

        return {
          id: item.coinId || index, // key로 사용할 ID
          // "2025-11-24T10:34:50.317Z" 형태의 문자열을 로컬 날짜로 변환
          paymentDate: new Date(item.createdAt).toLocaleDateString(),
          paymentMethod: item.paymentMethod || "결제 수단 정보 없음",
          chargeAmount: ` ₩ ${item.paymentAmount}`,
          coinCount: item.coinAmount, // 충전 코인 갯수
          isRefundable: isRefundable,
        };
      });

      setHistory(transformedData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch coin history:", err.response || err);
      // ... (오류 처리 로직 유지) ...
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefund = async (coinIdToRemove) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인 정보가 없습니다. 다시 로그인해 주세요.");
      return;
    }

    // POST /api/coins/refund API의 요청 본문
    const payload = { coinId: coinIdToRemove };

    try {
      // API Call: POST /api/coins/refund
      const response = await api.post(`/coins/refund`, payload);

      // API 응답 구조를 확인하여 성공 여부를 판단합니다.
      if (response.data && response.data.success) {
        // 성공 메시지 표시
        alert(`환불이 성공적으로 완료되었습니다.`);

        // 핵심: history 상태를 업데이트하여 환불된 항목을 목록에서 제거합니다.
        setHistory((prevHistory) =>
          prevHistory.filter((item) => item.id !== coinIdToRemove)
        );
      } else {
        // API가 200 OK를 반환했지만 논리적 오류가 있을 경우
        alert(
          response.data.message ||
            "환불 처리 중 알 수 없는 오류가 발생했습니다."
        );
      }
    } catch (err) {
      console.error("Refund Error:", err.response || err);
      let errorText = "환불 처리 중 네트워크 오류가 발생했습니다.";

      if (err.response?.data?.message) {
        errorText = err.response.data.message;
      } else if (err.response?.status === 403 || err.response?.status === 401) {
        errorText = "환불 권한이 없거나, 인증 정보가 만료되었습니다.";
      }
      alert(errorText);
    }
  };

  // 컴포넌트 마운트 시 데이터 호출
  useEffect(() => {
    fetchCoinHistory();
  }, []);

  // 로딩 및 에러 상태 렌더링
  if (isLoading) {
    return <div className="loading-message">충전 내역을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="error-message">오류: {error}</div>;
  }

  // 데이터가 없는 경우
  if (history.length === 0) {
    return (
      <div className={styles.wrapper}>
        <Sidebar />
        <div style={{ flex: 1, marginRight: "80px", minHeight: "500px" }}>
          <HeaderTabs />
          <div className="empty-message">충전 내역이 없습니다.</div>
        </div>
      </div>
    );
  }

  // 내역 목록 렌더링
  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div style={{ flex: 1, marginRight: "80px", minHeight: "500px" }}>
        <HeaderTabs />
        <div className="payment-list-wrapper">
          {history.map((item) => (
            <PaymentItem key={item.id} data={item} onRefund={handleRefund} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoinChargeHistory;
