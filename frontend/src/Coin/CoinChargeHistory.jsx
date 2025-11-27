import React, { useState, useEffect } from "react";
import api from "../api/axios"
import HeaderTabs from "./HeaderTabs";
import PaymentItem from "./PaymentItem";
import "../css/CoinChargeHistory.css";

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

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await api.get(`/coins/history`, config);

      const transformedData = response.data.map((item, index) => ({
        id: item.coinId || index, // key로 사용할 ID
        // "2025-11-24T10:34:50.317Z" 형태의 문자열을 로컬 날짜로 변환
        paymentDate: new Date(item.createdAt).toLocaleDateString(),
        paymentMethod: item.transactionType || "결제 수단 정보 없음",
        //TODO : 실제 금액 정보가 API에 없으므로 코인 수를 금액으로 임시 표시합니다.
        chargeAmount: ` ₩ ${item.coinAmount}`,
        coinCount: item.coinAmount, // 충전 코인 갯수
      }));

      setHistory(transformedData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch coin history:", err.response || err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        setError("인증 정보가 만료되었습니다. 다시 로그인해 주세요.");
      } else {
        setError("코인 내역을 가져오는 중 오류가 발생했습니다.");
      }
      setHistory([]);
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

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    // POST /api/coins/refund API의 요청 본문
    const payload = { coinId: coinIdToRemove };

    try {
      // API Call: POST /api/coins/refund
      const response = await api.post(`/coins/refund`, payload, config);

      // API 응답 구조를 확인하여 성공 여부를 판단합니다.
      if (response.data && response.data.success) {
        // 성공 메시지 표시
        alert(
          `환불이 성공적으로 완료되었습니다. (환불 코인: ${response.data.coinAmount}, 현재 잔액: ${response.data.currentBalance})`
        );

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
      <div>
        <HeaderTabs />
        <div className="empty-message">충전 내역이 없습니다.</div>
      </div>
    );
  }

  // 내역 목록 렌더링
  return (
    <div>
      <HeaderTabs />
      <div className="payment-list-wrapper">
        {history.map((item) => (
          <PaymentItem key={item.id} data={item} onRefund={handleRefund} />
        ))}
      </div>
    </div>
  );
};

export default CoinChargeHistory;
