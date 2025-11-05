package com.server.backend.controller;


import com.server.backend.model.ChatLink;
import com.server.backend.service.ChatLinkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
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
