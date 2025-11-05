package com.server.backend.model;

import org.springframework.data.annotation.Id;

public class ChatLink {

    @Id
    private String id;
    private String ownerEmail;
    private String contactEmail;
    private String contactName;

    public ChatLink() {}

    public ChatLink(String ownerEmail, String contactEmail, String contactName) {
        this.ownerEmail = ownerEmail;
        this.contactEmail = contactEmail;
        this.contactName = contactName;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }
}