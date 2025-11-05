package com.server.backend.repository;

import com.server.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface UserRepository extends MongoRepository<User, String> {
   User findByEmail(String email);

   List<User> findByEmailContainingIgnoreCase(String email);
}
