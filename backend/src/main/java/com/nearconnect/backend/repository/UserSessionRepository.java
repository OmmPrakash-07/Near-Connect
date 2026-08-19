package com.nearconnect.backend.repository;

import com.nearconnect.backend.model.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    Optional<UserSession> findByTokenAndExpiresAtAfter(String token, Instant now);
    void deleteByToken(String token);
}
