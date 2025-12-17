package com.server.backend.controller;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.server.backend.model.ChatLink;
import com.server.backend.service.ChatLinkService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000", originPatterns = "http://192.168.1.3:3000")
public class ChatLinkController {

    private final ChatLinkService chatLinkService;

    public ChatLinkController(ChatLinkService chatLinkService) {
        this.chatLinkService = chatLinkService;
    }

    @GetMapping("/list")
    public ResponseEntity<List<ChatLink>> getChatsForOwner(@RequestParam String ownerEmail) {
        return ResponseEntity.ok(chatLinkService.getChatsForOwner(ownerEmail));
    }

    @PostMapping("/add")
    public ResponseEntity<ChatLink> addChatLink(@RequestBody ChatLink chatLink) {
        if (chatLink.getOwnerEmail() == null || chatLink.getContactEmail() == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(chatLinkService.addChatLink(chatLink));
    }
}
