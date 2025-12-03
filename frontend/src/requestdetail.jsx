import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./requestdetail.css";
import api from "./api/axios";
import Sidebar from "./page/MyPage/Sidebar";
import styles from "./page/MyPage/MyPage.module.css";

export default function RequestHistoryPage() {
  const [activeTab, setActiveTab] = useState("sent");

  const [sentList, setSentList] = useState([]);
  const [receivedList, setReceivedList] = useState([]);



  const fetchMatchData = async () => {
    try {
      const sent = await api.get("/matches/sent");
      const received = await api.get("/matches/received");

      setSentList(sent.data);
      setReceivedList(received.data);
    } catch (error) {
      console.error("매칭 내역 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchMatchData();
  }, []);

  const acceptMatch = async (matchId) => {
    try {
      await api.patch(`/matches/${matchId}/accept`, null);
      fetchMatchData();
    } catch (error) {
      console.error("매칭 수락 실패:", error);
    }
  };

  const declineMatch = async (matchId) => {
    try {
      await api.patch(`/api/matches/${matchId}/decline`, null);
      fetchMatchData();
    } catch (error) {
      console.error("매칭 거절 실패:", error);
    }
  };

  const getStatusDotClass = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "status-dot--accepted";
      case "DECLINED":
        return "status-dot--rejected";
      default:
        return "status-dot--pending";
    }
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar />

      <section
        className="request-content"
        style={{ flex: 1, marginRight: "80px", minHeight: "500px" }}
      >
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
              (activeTab === "sent" ? " request-tab--active" : "")
            }
            onClick={() => setActiveTab("sent")}
          >
            받은 요청
          </button>
          <button
            className={
              "request-tab" +
              (activeTab === "received" ? " request-tab--active" : "")
            }
            onClick={() => setActiveTab("received")}
          >
            매칭수락
          </button>
        </div>
        {activeTab === "sent" && (
          <>
            <div className="status-legend">
              <span>
                <span className="status-dot status-dot--accepted" /> 수락됨
              </span>
              <span>
                <span className="status-dot status-dot--rejected" /> 거절됨
              </span>
              <span>
                <span className="status-dot status-dot--pending" /> 응답없음
              </span>
            </div>

            <ul className="request-list">
              {sentList.map((item) => (
                <li key={item.ordersId} className="request-row">
                  <div className="request-row-left">
                    <span className="request-row-title">
                      {item.usersName || "상대"} 님과의 매칭
                    </span>
                  </div>

                  <div className="request-row-right">
                    <span className="request-row-status-label">현재상태 :</span>

                    <span
                      className={`status-dot ${getStatusDotClass(
                        item.orderStatus
                      )}`}
                    />

                    <button className="info-button" disabled>
                      상대 정보 확인하기
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        {activeTab === "received" && (
          <ul className="request-list">
            {receivedList.map((item) => (
              <li key={item.ordersId} className="request-row">
                <div className="request-row-left">
                  <span className="request-row-title">
                    {item.usersName || "상대"} 님의 매칭요청
                  </span>
                </div>

                <div className="request-row-right">
                  <button
                    className="pill-button pill-button--accept"
                    onClick={() => acceptMatch(item.ordersId)}
                  >
                    수락
                  </button>
                  <button
                    className="pill-button pill-button--reject"
                    onClick={() => declineMatch(item.ordersId)}
                  >
                    거절
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
