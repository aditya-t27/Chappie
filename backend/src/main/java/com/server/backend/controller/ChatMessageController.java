package com.server.backend.controller;


import com.server.backend.model.ChatMessage;
import com.server.backend.service.ChatMessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatMessageController {



    private final ChatMessageService service;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatMessageController(ChatMessageService service, SimpMessagingTemplate messagingTemplate) {
        this.service = service;
        this.messagingTemplate = messagingTemplate;
    }

    // REST: get history between two users
    @GetMapping("/history")
    public List<ChatMessage> getHistory(@RequestParam String sender, @RequestParam String receiver) {
        return service.getChatHistory(sender, receiver);
    }

    // REST fallback: save and broadcast
    @PostMapping("/send")
    public ChatMessage sendRest(@RequestBody ChatMessage msg) {

        if (msg.getTimestamp() == null) {
            msg.setTimestamp(LocalDateTime.now());
        }

        ChatMessage saved = service.save(msg);

        messagingTemplate.convertAndSendToUser(saved.getReceiverEmail(), "/queue/messages", saved);
        messagingTemplate.convertAndSendToUser(saved.getSenderEmail(), "/queue/messages", saved);
        return saved;
    }


    @MessageMapping("/sendMessage")
    public void receiveMessage(@Payload ChatMessage msg) {

        if (msg.getTimestamp() == null) {
            msg.setTimestamp(LocalDateTime.now());
        }

        ChatMessage saved = service.save(msg);

        messagingTemplate.convertAndSendToUser(saved.getReceiverEmail(), "/queue/messages", saved);
        messagingTemplate.convertAndSendToUser(saved.getSenderEmail(), "/queue/messages", saved);
    }
}
