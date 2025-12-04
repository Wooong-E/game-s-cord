import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./requestdetail.css";
import api from "./api/axios";
import Sidebar from "./page/MyPage/Sidebar";
import styles from "./page/MyPage/MyPage.module.css";

const getGameName = (gameId) => {
  switch (gameId) {
    case 1:
      return "League of Legends";
    case 2:
      return "Battlegrounds";
    case 3:
      return "Overwatch";
    default:
      return "Unknown Game";
  }
};

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
      await api.patch(`/matches/${matchId}/decline`, null);
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
        <div className="request-title">
          신청내역
        </div>
        <div className="request-tabs">
          <button
            className={
              "request-tab" +
              (activeTab === "sent" ? " request-tab--active" : "")
            }
            onClick={() => setActiveTab("sent")}
          >
            대기중
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
            

            <ul className="request-list">
              {sentList.map((item) => (
                <li key={item.ordersId} className="request-row">
                  <div className="request-row-left">
                    <span className="request-row-title">
                      {item.orderedUsername || "상대"} 님과의 매칭
                    </span>
                    <span style={{marginRight:16}}>
                      게임명:{getGameName(item.ordersGameId)}
                    </span>
                  </div>
                  

                  <div className="request-row-right">
                    <span className="request-row-title">
                      
                    </span>
                    <span className="request-row-status-label">요청 대기중</span>

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
                    {item.orderedUsername || "상대"} 님의 매칭요청 게임명:{getGameName(item.ordersGameId)}
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
