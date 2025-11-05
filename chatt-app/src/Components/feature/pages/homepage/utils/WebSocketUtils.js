// import { Client } from "@stomp/stompjs";
// import SockJS from "sockjs-client";
// import axios from "axios";

// const API_BASE = "http://localhost:8080";
// const WS_ENDPOINT = `${API_BASE}/ws`;
// let stompClient = null;

// /**
//  * Connect WebSocket and subscribe to the user's private queue.
//  * @param {string} ownerEmail - logged-in user's email
//  * @param {(msg) => void} onMessageReceived - callback invoked with parsed message object
//  * @returns {() => void} disconnect function
//  */
// export const connectWebSocket = (ownerEmail, onMessageReceived) => {
//   if (!ownerEmail) return null;

//   const socket = new SockJS(`${WS_ENDPOINT}?userEmail=${ownerEmail}`);
//   stompClient = new Client({
//     webSocketFactory: () => socket,
//     reconnectDelay: 5000,
//     debug: () => {},

//     connectHeaders: {
//       user: ownerEmail, // used for mapping WebSocket user sessions
//     },

//     onConnect: () => {
//       console.log(`[WebSocket Connected] as ${ownerEmail}`);

//       // 🔹 Subscribe to personal private queue
//       stompClient.subscribe("/user/queue/messages", (message) => {
//         try {
//           const payload = JSON.parse(message.body);
//           handleIncomingMessage(payload, ownerEmail, onMessageReceived);
//         } catch (e) {
//           console.error("Invalid WS message", e);
//         }
//       });

//       // 🔹 Optional: if backend also broadcasts to /topic/messages
//       stompClient.subscribe("/topic/messages", (message) => {
//         try {
//           const payload = JSON.parse(message.body);
//           handleIncomingMessage(payload, ownerEmail, onMessageReceived);
//         } catch (e) {
//           // ignore
//         }
//       });
//     },

//     onStompError: (frame) => {
//       console.error("STOMP error:", frame);
//     },
//   });

//   stompClient.activate();

//   return () => {
//     try {
//       stompClient.deactivate();
//       stompClient = null;
//       console.log("WebSocket disconnected.");
//     } catch (e) {
//       console.error("WebSocket cleanup error", e);
//     }
//   };
// };

// /**
//  * Deduplication + correct routing (so multiple tabs don’t double-display)
//  */
// const handleIncomingMessage = (payload, ownerEmail, onMessageReceived) => {
//   if (!payload || !payload.senderEmail || !payload.receiverEmail) return;

//   // 🔹 Avoid duplicate messages — each message should have a unique ID or timestamp
//   const uniqueKey = `${payload.id || ""}_${payload.timestamp || ""}_${payload.content}`;
//   if (window.__lastMessages?.has(uniqueKey)) return;
//   if (!window._lastMessages) window._lastMessages = new Set();
//   window.__lastMessages.add(uniqueKey);
//   if (window.__lastMessages.size > 500) {
//     // limit memory usage
//     window.__lastMessages.clear();
//   }

//   // 🔹 Deliver to callback
//   onMessageReceived(payload);
// };

// /**
//  * Send a private message. Backend should handle persistence + forwarding.
//  * payload: { senderEmail, receiverEmail, content, timestamp? }
//  */
// export const sendMessage = (payload) => {
//   if (!stompClient || !stompClient.connected) {
//     console.warn("WebSocket not connected - fallback to REST POST");
//     axios.post(`${API_BASE}/api/messages/send`, payload).catch((e) => console.error(e));
//     return;
//   }

//   stompClient.publish({
//     destination: "/app/sendMessage",
//     body: JSON.stringify(payload),
//   });
// };

// /**
//  * Fetch chat history between two users (REST)
//  */
// export const fetchChatHistory = async (sender, receiver) => {
//   try {
//     const res = await axios.get(`${API_BASE}/api/messages/history`, {
//       params: { sender, receiver },
//     });
//     return res.data || [];
//   } catch (err) {
//     console.error("fetchChatHistory error:", err);
//     return [];
//   }
// };

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";

const API_BASE = "http://localhost:8080";
const WS_ENDPOINT = `${API_BASE}/ws`; // matches backend registerStompEndpoints("/ws")
let stompClient = null;

/**
 * Connect WebSocket and subscribe to the user's private queue.
 * @param {string} ownerEmail - logged-in user's email
 * @param {(msg) => void} onMessageReceived - callback invoked with parsed message object
 * @returns {() => void} disconnect function
 */
export const connectWebSocket = (ownerEmail, onMessageReceived) => {
  if (!ownerEmail) return null;

  const socket = new SockJS(`${WS_ENDPOINT}?userEmail=${ownerEmail}`);
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: () => {},
    connectHeaders: {
      // optional header; Spring Security required to map principal. Many setups ignore this.
      // we still supply it so backend can (optionally) pick it up if configured.
      user: ownerEmail,
    },
    onConnect: () => {
      // Subscribe to user-specific queue — Spring maps '/user/queue/messages' for the logged-in principal
      stompClient.subscribe("/user/queue/messages", (message) => {
        try {
          const payload = JSON.parse(message.body);
          onMessageReceived(payload);
        } catch (e) {
          console.error("Invalid WS message", e);
        }
      });

      // Optional: subscribe to broadcast topic if your backend broadcasts to /topic/messages
      stompClient.subscribe("/topic/messages", (message) => {
        try {
          const payload = JSON.parse(message.body);
          // payload likely contains sender/receiver — deliver to callback if relevant
          onMessageReceived(payload);
        } catch (e) {
          /* ignore */
        }
      });
    },
    onStompError: (frame) => {
      console.error("STOMP error:", frame);
    },
  });

  stompClient.activate();

  // return a disconnect function
  return () => {
    try {
      stompClient.deactivate();
    } catch (e) {
      /* ignore */
    }
    stompClient = null;
  };
};

/**
 * Send a private message. Backend should handle persistence and forwarding.
 * payload: { senderEmail, receiverEmail, content, timestamp? }
 */
export const sendMessage = (payload) => {
  if (!stompClient || !stompClient.connected) {
    console.warn("WebSocket not connected - fallback to REST POST");
    // fallback: call REST save endpoint (if backend provides it)
    axios.post(`${API_BASE}/api/messages/send`, payload).catch((e) => console.error(e));
    return;
  }

  // publish to application destination handled by @MessageMapping("/sendMessage") on server
  stompClient.publish({
    destination: "/app/sendMessage",
    body: JSON.stringify(payload),
  });
};

/**
 * Fetch chat history between two users (REST)
 */
export const fetchChatHistory = async (sender, receiver) => {
  try {
    const res = await axios.get(`${API_BASE}/api/messages/history`, {
      params: { sender, receiver },
    });
    return res.data || [];
  } catch (err) {
    console.error("fetchChatHistory error:", err);
    return [];
  }
};