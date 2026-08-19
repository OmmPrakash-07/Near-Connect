package com.nearconnect.backend.repository;

import com.nearconnect.backend.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {
    Optional<Match> findByUser1AndUser2(Long user1, Long user2);
    List<Match> findByUser1OrUser2OrderByCreatedAtDesc(Long user1, Long user2);
}
