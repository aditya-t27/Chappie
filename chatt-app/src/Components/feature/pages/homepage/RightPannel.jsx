import React, { useState, useRef, useEffect } from 'react';
import { connectWebSocket ,sendMessage,fetchChatHistory} from './utils/WebSocketUtils';
import CustomAppBar from '../../../../foundation/customAppBar/CustomAppBar'
import Avatar from '@mui/material/Avatar';
import SearchIcon from '@mui/icons-material/Search'
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CustomMenuButton from '../../../../foundation/CustomMenuButton/CustomMenuButton'
//import bg from '../../../Assets/whatapp_bg_image.jpg'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import Input from '@mui/material/Input';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';


const RightPannel = ({ selectedUser, chats, setChats }) => {


  const ownerEmail = localStorage.getItem("userEmail");
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Load history when selectedUser changes
  useEffect(() => {
    if (!selectedUser || !ownerEmail) return;
    const loadHistory = async () => {
      try {
        const msgs = await fetchChatHistory(ownerEmail, selectedUser.contactEmail);
        // msgs are objects { senderEmail, receiverEmail, content, timestamp, id? }
        setChats((prev) => ({ ...prev, [selectedUser.contactEmail]: msgs }));
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };
    loadHistory();
  }, [selectedUser, ownerEmail, setChats]);

  // derive messages list
  const userMessages = selectedUser ? (chats[selectedUser.contactEmail] || []) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [userMessages, selectedUser]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    const payload = {
      senderEmail: ownerEmail,
      receiverEmail: selectedUser.contactEmail,
      content: newMessage,
      // timestamp: new Date().toISOString(),
    };
    // send via websocket (backend will broadcast and save)
    sendMessage(payload);
    // optimistically append in UI
    // setChats((prev) => ({
    //   ...prev,
    //   [selectedUser.contactEmail]: [...(prev[selectedUser.contactEmail] || []), payload],
    // }));
    setNewMessage("");
  };

  if (!selectedUser) {
    return (
      <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center", color: "gray" }}>
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CustomAppBar>
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar style={{marginTop:"10px"}} />
            <div style={{ marginLeft: 10 }}>
              <Typography variant="body1" style={{ color: "white", marginTop:"8px" }}>{selectedUser.contactName || selectedUser.contactEmail}</Typography>
              <Typography variant="caption" style={{ color: "white" }}></Typography>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <IconButton><SearchIcon style={{ color: "white" }} /></IconButton>
            <CustomMenuButton />
          </div>
        </div>
      </CustomAppBar>

      <div style={{ flex: 1, padding: 12, overflowY: "auto", display: "flex", flexDirection: "column" }}
        className="rightpannel-chat-container"
      >
        {userMessages.map((msg, i) => {
          const isMe = msg.senderEmail === ownerEmail;
          return (
            <div key={msg.id || i} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: 8 }}>
              <div style={{
                background: isMe ? "#1da088ff" : "#2b3943",
                color: "white",
                padding: "8px 12px",
                borderRadius: 12,
                maxWidth: "70%",
                wordBreak: "break-word"
              }}>
                <div style={{ display:'flex',marginBottom: 2 }}>{msg.content}
                <div style={{ fontSize: 10,marginLeft:'8px', marginTop:'10px',color: "#cfcfcf", textAlign: "right" }}>
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }) : ""}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ height: 65, display: "flex", alignItems: "center", padding: "0 12px", background: "#1f2c33" }}>
        <IconButton><SentimentVerySatisfiedIcon style={{ color: "white" }} /></IconButton>
        <IconButton><AttachFileIcon style={{ color: "white" }} /></IconButton>

        <div style={{ flex: 1, padding: "0 8px" }}>
          <Input
            fullWidth
            disableUnderline
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            style={{ background: "#2b3943", borderRadius: 6, height: 45, padding: "0 12px", color: "white" }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleSend}><SendIcon style={{ color: "white" }} /></IconButton>
              </InputAdornment>
            }
          />
        </div>

        <IconButton><MicIcon style={{ color: "white" }} /></IconButton>
      </div>
    </div>
  );
};

export default RightPannel;


// import React, { useState, useRef, useEffect } from 'react';
// import { connectWebSocket, sendMessage, fetchChatHistory } from './utils/WebSocketUtils';
// import CustomAppBar from '../../../../foundation/customAppBar/CustomAppBar';
// import Avatar from '@mui/material/Avatar';
// import SearchIcon from '@mui/icons-material/Search';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import CustomMenuButton from '../../../../foundation/CustomMenuButton/CustomMenuButton';
// import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
// import AttachFileIcon from '@mui/icons-material/AttachFile';
// import MicIcon from '@mui/icons-material/Mic';
// import Input from '@mui/material/Input';
// import SendIcon from '@mui/icons-material/Send';
// import InputAdornment from '@mui/material/InputAdornment';

// const RightPannel = ({ currentUser, selectedUser, chats, setChats }) => {
//   const ownerEmail = localStorage.getItem("userEmail");
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef(null);

//   // Load chat history from backend (MongoDB)
//   useEffect(() => {
//     if (!selectedUser || !ownerEmail) return;
//     (async () => {
//       try {
//         const msgs = await fetchChatHistory(ownerEmail, selectedUser.contactEmail);
//         setChats((prev) => ({ ...prev, [selectedUser.contactEmail]: msgs }));
//       } catch (err) {
//         console.error("Failed to load history:", err);
//       }
//     })();
//   }, [selectedUser, ownerEmail, setChats]);

//   const userMessages = selectedUser ? (chats[selectedUser.contactEmail] || []) : [];

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [userMessages, selectedUser]);

//   // Initialize WebSocket and subscribe to incoming messages
//   useEffect(() => {
//     if (!ownerEmail) return;
//     connectWebSocket(ownerEmail, (msg) => {
//       const data = JSON.parse(msg.body);
//       if (
//         (data.senderEmail === ownerEmail && data.receiverEmail === selectedUser?.contactEmail) ||
//         (data.senderEmail === selectedUser?.contactEmail && data.receiverEmail === ownerEmail)
//       ) {
//         setChats((prev) => ({
//           ...prev,
//           [selectedUser.contactEmail]: [...(prev[selectedUser.contactEmail] || []), data],
//         }));
//       }
//     });
//   }, [selectedUser, ownerEmail, setChats]);

//   // Send message
//   const handleSend = () => {
//     if (!newMessage.trim() || !selectedUser) return;
//     const payload = {
//       senderEmail: ownerEmail,
//       receiverEmail: selectedUser.contactEmail,
//       content: newMessage,
//       timestamp: new Date().toISOString(),
//     };
//     sendMessage(payload);
//     // setChats((prev) => ({
//     //   ...prev,
//     //   [selectedUser.contactEmail]: [...(prev[selectedUser.contactEmail] || []), payload],
//     // }));
//     setNewMessage("");
//   };

//   if (!selectedUser) {
//     return (
//       <div style={{
//         height: "100%",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         color: "gray",
//         fontSize: "16px"
//       }}>
//         Select a chat to start messaging
//       </div>
//     );
//   }

//   return (
//     <div style={{
//       height: "100%",
//       display: "flex",
//       flexDirection: "column",
//       background: "#0b141a"
//     }}>
//       {/* Header */}
//       <CustomAppBar>
//         <div style={{
//           width: "100%",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center"
//         }}>
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <Avatar />
//             <div style={{ marginLeft: 10 }}>
//               <Typography variant="body1" style={{ color: "white" }}>
//                 {selectedUser.contactName || selectedUser.contactEmail}
//               </Typography>
//               <Typography variant="caption" style={{ color: "white" }}>
//                 online
//               </Typography>
//             </div>
//           </div>
//           <div style={{ display: "flex" }}>
//             <IconButton><SearchIcon style={{ color: "white" }} /></IconButton>
//             <CustomMenuButton />
//           </div>
//         </div>
//       </CustomAppBar>

//       {/* Chat body */}
//       <div style={{
//         flex: 1,
//         padding: 12,
//         overflowY: "auto",
//         display: "flex",
//         flexDirection: "column",
//         background: "#121b22"
//       }}>
//         {userMessages.map((msg, i) => {
//           const isMe = msg.senderEmail === ownerEmail;
//           return (
//             <div
//               key={msg.id || i}
//               style={{
//                 display: "flex",
//                 justifyContent: isMe ? "flex-end" : "flex-start",
//                 marginBottom: 8
//               }}
//             >
//               <div style={{
//                 background: isMe ? "#1da088ff" : "#2b3943",
//                 color: "white",
//                 padding: "8px 12px",
//                 borderRadius: 12,
//                 maxWidth: "70%",
//                 wordBreak: "break-word",
//                 alignSelf: isMe ? "flex-end" : "flex-start"
//               }}>
//                 <div style={{ marginBottom: 6 }}>{msg.content}</div>
//                 <div style={{
//                   fontSize: 10,
//                   color: "#cfcfcf",
//                   textAlign: "right"
//                 }}>
//                   {msg.timestamp ? new Date(msg.timestamp)
//                     .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input bar */}
//       <div style={{
//         height: 65,
//         display: "flex",
//         alignItems: "center",
//         padding: "0 12px",
//         background: "#1f2c33"
//       }}>
//         <IconButton><SentimentVerySatisfiedIcon style={{ color: "white" }} /></IconButton>
//         <IconButton><AttachFileIcon style={{ color: "white" }} /></IconButton>

//         <div style={{ flex: 1, padding: "0 8px" }}>
//           <Input
//             fullWidth
//             disableUnderline
//             placeholder="Type a message"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//             style={{
//               background: "#2b3943",
//               borderRadius: 6,
//               height: 45,
//               padding: "0 12px",
//               color: "white"
//             }}
//             endAdornment={
//               <InputAdornment position="end">
//                 <IconButton onClick={handleSend}>
//                   <SendIcon style={{ color: "white" }} />
//                 </IconButton>
//               </InputAdornment>
//             }
//           />
//         </div>

//         <IconButton><MicIcon style={{ color: "white" }} /></IconButton>
//       </div>
//     </div>
//   );
// };

// export default RightPannel;