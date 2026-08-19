package com.nearconnect.backend.model;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "user_matches", uniqueConstraints = @UniqueConstraint(
        name = "uk_match_pair", columnNames = {"user_1", "user_2"}))
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_1", nullable = false)
    private Long user1;

    @Column(name = "user_2", nullable = false)
    private Long user2;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() { if (createdAt == null) createdAt = Instant.now(); }

    public Long getId() { return id; }
    public Long getUser1() { return user1; }
    public void setUser1(Long user1) { this.user1 = user1; }
    public Long getUser2() { return user2; }
    public void setUser2(Long user2) { this.user2 = user2; }
    public Instant getCreatedAt() { return createdAt; }
}
