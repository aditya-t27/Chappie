package com.server.backend.repository;

import com.server.backend.model.ChatLink;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatLinkRepository extends MongoRepository<ChatLink, String> {

    List<ChatLink> findByOwnerEmailOrderByContactEmailAsc(String ownerEmail);

    Optional<ChatLink> findByOwnerEmailAndContactEmail(String ownerEmail, String contactEmail);

    boolean existsByOwnerEmailAndContactEmail(String ownerEmail, String contactEmail);
}
