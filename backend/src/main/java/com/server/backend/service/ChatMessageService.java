package com.server.backend.service;


import com.server.backend.model.ChatMessage;
import com.server.backend.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatMessageService {

    private final ChatMessageRepository repo;
    private final ChatLinkService chatLinkService;

    public ChatMessageService(ChatMessageRepository repo, ChatLinkService chatLinkService) {
        this.repo = repo;
        this.chatLinkService = chatLinkService;
    }

    public ChatMessage save(ChatMessage m){
        if (m.getTimestamp() == null) {
            m.setTimestamp(LocalDateTime.now());
        }

        ChatMessage saved = repo.save(m);

        // Ensure both users have each other in their chat list
        chatLinkService.ensureChatLinkExists(m.getSenderEmail(), m.getReceiverEmail());
        chatLinkService.ensureChatLinkExists(m.getReceiverEmail(), m.getSenderEmail());
//        return repo.save(m);
        return saved;
    }

    public List<ChatMessage> getChatHistory(String userA, String userB) {
        return repo.findBySenderEmailAndReceiverEmailOrReceiverEmailAndSenderEmailOrderByTimestampAsc(
                userA, userB, userA, userB
        );
    }
}
