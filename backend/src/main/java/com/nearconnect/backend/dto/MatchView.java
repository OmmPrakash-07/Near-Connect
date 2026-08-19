package com.nearconnect.backend.dto;

import com.nearconnect.backend.model.Message;

import java.time.Instant;

public record MatchView(Long id, UserView otherUser, String lastMessage, Instant lastActivityAt, Instant matchedAt) {

    public static MatchView of(Long id, UserView otherUser, Message lastMessage, Instant matchedAt) {
        return new MatchView(
                id,
                otherUser,
                lastMessage == null ? null : lastMessage.getMessage(),
                lastMessage == null ? matchedAt : lastMessage.getTimestamp(),
                matchedAt
        );
    }
}
