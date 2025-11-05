import React from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

const ChatCard = ({ selected, user }) => {
  return (
    <div style={{
      display: "flex",
      padding: 12,
      cursor: "pointer",
      borderRadius: 8,
      margin: "4px 8px",
      alignItems: "center",
      background: selected ? "#2578b4ff" : "#101b20",
    }}>
      <Avatar>{(user.contactName || user.contactEmail).charAt(0).toUpperCase()}</Avatar>
      <div style={{ marginLeft: 12 }}>
        <Typography variant="body1" style={{ color: "#d1d7db" }}>
          {user.contactName || user.contactEmail}
        </Typography>
        <Typography variant="caption" style={{ color: "#8696a0" }}>
          {user.contactEmail}
        </Typography>
      </div>
    </div>
  );
};

ChatCard.propTypes = {
  selected: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

export default ChatCard;