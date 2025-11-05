package com.server.backend.service;

import com.server.backend.model.ChatLink;
import com.server.backend.repository.ChatLinkRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChatLinkService {

    private final ChatLinkRepository chatLinkRepository;

    public ChatLinkService(ChatLinkRepository chatLinkRepository) {
        this.chatLinkRepository = chatLinkRepository;
    }

    public List<ChatLink> getChatsForOwner(String ownerEmail) {
        return chatLinkRepository.findByOwnerEmailOrderByContactEmailAsc(ownerEmail);
    }

    public ChatLink addChatLink(ChatLink chatLink) {
        Optional<ChatLink> existing = chatLinkRepository.findByOwnerEmailAndContactEmail(
                chatLink.getOwnerEmail(), chatLink.getContactEmail()
        );

        return existing.orElseGet(() -> chatLinkRepository.save(
                new ChatLink(chatLink.getOwnerEmail(), chatLink.getContactEmail(), chatLink.getContactName())
        ));
    }

    // ✅ Auto-create link between two users if missing
    public void ensureChatLinkExists(String ownerEmail, String contactEmail) {
        boolean exists = chatLinkRepository.existsByOwnerEmailAndContactEmail(ownerEmail, contactEmail);
        if (!exists) {
            ChatLink link = new ChatLink();
            link.setOwnerEmail(ownerEmail);
            link.setContactEmail(contactEmail);
            link.setContactName(contactEmail); // you can improve later to fetch name
            chatLinkRepository.save(link);
        }
    }
}