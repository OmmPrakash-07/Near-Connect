package com.nearconnect.backend.repository;

import com.nearconnect.backend.model.Swipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SwipeRepository extends JpaRepository<Swipe, Long> {
    Optional<Swipe> findByUserIdAndTargetUserId(Long userId, Long targetUserId);
    List<Swipe> findByUserId(Long userId);
}
