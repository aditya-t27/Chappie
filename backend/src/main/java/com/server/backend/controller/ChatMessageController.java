package com.server.backend.controller;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.server.backend.model.ChatMessage;
import com.server.backend.service.ChatMessageService;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000", originPatterns = "http://192.168.1.3:3000")
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
