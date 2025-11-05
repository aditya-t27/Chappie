package com.server.backend.repository;

import com.server.backend.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends MongoRepository <ChatMessage, String>{
    List<ChatMessage> findBySenderEmailAndReceiverEmailOrReceiverEmailAndSenderEmailOrderByTimestampAsc(
            String sender1, String receiver1, String sender2, String receiver2);
}
