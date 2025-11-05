import React, { useState, useEffect } from "react";
import LeftPannel from "./LeftPannel";
import RightPannel from "./RightPannel";
import axios from "axios";
import { connectWebSocket, fetchChatHistory } from "./utils/WebSocketUtils";

const API_BASE = "http://localhost:8080";

const Homepage = () => {
  const [selectedUser, setSelectedUser] = useState(null); // { contactEmail, contactName, id }
  const [chatUsers, setChatUsers] = useState([]); // saved contacts from server
  const [chats, setChats] = useState({}); // messages per contactEmail

  const ownerEmail = localStorage.getItem("userEmail") || null;

  useEffect(() => {
          document.title = "Chappie App";
      }, []);


  // Connect websocket once on mount (and when ownerEmail becomes available)
  useEffect(() => {
    if (!ownerEmail) return;
    const disconnect = connectWebSocket(ownerEmail, (msg) => {
      // msg: { senderEmail, receiverEmail, content, timestamp, id? }
      const contactEmail = msg.senderEmail === ownerEmail ? msg.receiverEmail : msg.senderEmail;
      setChats((prev) => ({
        ...prev,
        [contactEmail]: [...(prev[contactEmail] || []), msg],
      }));
    });

    return () => {
      if (disconnect) disconnect();
    };
  }, [ownerEmail]);

  // Load saved contacts (chat list)
  useEffect(() => {
    if (!ownerEmail) return;
    const fetchList = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/chat/list`, {
          params: { ownerEmail },
        });
        // Server returns ChatLink objects: { id, ownerEmail, contactEmail, contactName }
        setChatUsers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch chat list:", err);
      }
    };
    fetchList();
  }, [ownerEmail]);

  // Handler when selecting a user (from search or clicking an existing chat)
  // user can be either a search result { email, name } or a ChatLink { contactEmail, contactName, id }
  const handleUserSelect = async (user) => {
    if (!user) return;
    // normalize to { contactEmail, contactName }
    const contactEmail = user.contactEmail || user.email;
    const contactName = user.contactName || user.name || contactEmail;

    // If not saved, call backend to add
    const alreadySaved = chatUsers.some((c) => c.contactEmail === contactEmail);
    if (!alreadySaved && ownerEmail) {
      try {
        const res = await axios.post(`${API_BASE}/api/chat/add`, {
          ownerEmail,
          contactEmail,
          contactName,
        });
        const saved = res.data;
        setChatUsers((prev) => [...prev, saved]);
      } catch (err) {
        console.error("Failed to save contact:", err);
      }
    }

    // set as selected user (normalized)
    setSelectedUser({ contactEmail, contactName });
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
      <div style={{ width: "30%", background: "#2b3943" }}>
        <LeftPannel
          onUserSelect={handleUserSelect}
          chatUsers={chatUsers}
          setChatUsers={setChatUsers}
          selectedUser={selectedUser}
        />
      </div>

      <div style={{ border: "0.5px solid #2f3b44" }} />

      <div style={{ width: "70%", background: "#0b141a" }}>
        <RightPannel
          selectedUser={selectedUser}
          chats={chats}
          setChats={setChats}
        />
      </div>
    </div>
  );
};

export default Homepage;