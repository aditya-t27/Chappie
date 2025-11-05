import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomAppBar from '../../../../foundation/customAppBar/CustomAppBar'
import IconButton from '@mui/material/IconButton';
import CustomMenuButton from '../../../../foundation/CustomMenuButton/CustomMenuButton'
import ChatIcon from '@mui/icons-material/Chat';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ChatCard from '../../../../foundation/ChatCard/ChatCard';
import Input from '@mui/material/Input';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';


const API_BASE = "http://localhost:8080";

const LeftPannel = ({ onUserSelect, chatUsers, setChatUsers, selectedUser }) => {


  const [searchQuery, setSearchQuery] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [loggedInEmail, setLoggedInEmail] = useState(localStorage.getItem("userEmail") || "");

  // // ✅ Load existing chat list
  // useEffect(() => {
  //   if (!loggedInEmail) return;

  //   axios
  //     .get(`${API_BASE}/api/chat/list`, { params: { ownerEmail: loggedInEmail } })
  //     .then((res) => {
  //       setChatUsers(res.data || []);
  //     })
  //     .catch((err) => {
  //       console.error("Failed to load chat list:", err);
  //     });
  // }, [loggedInEmail, setChatUsers]);

  // search users (backend /api/users/search)
  useEffect(() => {
    const t = setTimeout(() => {
      if (!searchQuery.trim()) {
        setUserResults([]);
        return;
      }
      axios
        .get(`${API_BASE}/api/users/search`, { params: { query: searchQuery } })
        .then((res) => {
          const matches = (res.data || []).filter(
            (u) => u.email.toLowerCase().includes(searchQuery.toLowerCase()) && u.email !== loggedInEmail
          );
          setUserResults(matches);
        })
        .catch((err) => {
          console.error("Search error:", err);
        });
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery, loggedInEmail]);

  // when clicking a search result: add contact (server) and open chat (via onUserSelect)
  const handleUserClick = async (user) => {

      onUserSelect({
        ownerEmail: loggedInEmail,
        contactEmail: user.email,
        contactName: user.name || user.email,

      });
      setSearchQuery("");
      setUserResults([]);

  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <CustomAppBar>
        <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 22, color: "white" }}>Chats</div>
          <div style={{ display: "flex" }}>
            <IconButton><FilterListIcon style={{ color: "white" }} /></IconButton>
            <CustomMenuButton />
          </div>
        </div>
      </CustomAppBar>

      <div style={{ display: "flex", padding: 12, background: "#071f2bff" }}>
        <div style={{ display: "flex", alignItems: "center", flex: 1, borderRadius: 8, padding: "0 8px", background: "#2b3943" }}>
          <IconButton><SearchIcon style={{ color: "white" }} /></IconButton>
          <Input
            fullWidth
            disableUnderline
            placeholder="Search or start a new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ height: 45, color: "white", padding: "0 8px" }}
          />
        </div>
      </div>

      {/* search results */}
      <div style={{ overflowY: "auto", padding: 8 }}>
        {searchQuery.trim() !== "" ? (
          userResults.length === 0 ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 20, color: "white", opacity: 0.8 }}>
              <SearchIcon style={{ marginRight: 6 }} /> No user found
            </div>
          ) : (
            userResults.map((u) => (
              <div key={u.email} onClick={() => handleUserClick(u)} style={{ display: "flex", alignItems: "center", padding: 10, cursor: "pointer", borderRadius: 6 }}>
                <Avatar>{(u.name || u.email).charAt(0).toUpperCase()}</Avatar>
                <div style={{ marginLeft: 10 }}>
                  <Typography variant="body1" style={{ color: "white" }}>{u.email}</Typography>
                  <Typography variant="caption" style={{ color: "#9aa6ad" }}>{u.name || ""}</Typography>
                </div>
              </div>
            ))
          )
        ) : null}
      </div>

      {/* persisted chat list */}
      {searchQuery.trim() === "" && (
        <div style={{ overflowY: "auto", flex: 1, padding: 8 }}>
          {chatUsers.length === 0 ? (
            <div style={{ color: "gray", padding: 20, textAlign: "center" }}>No chats yet. Search and start a new chat!</div>
          ) : (
            chatUsers.map((c) => (
              <div key={c.contactEmail} onClick={() => onUserSelect({ contactEmail: c.contactEmail, contactName: c.contactName })}>
                <ChatCard selected={selectedUser?.contactEmail === c.contactEmail} user={c} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LeftPannel;