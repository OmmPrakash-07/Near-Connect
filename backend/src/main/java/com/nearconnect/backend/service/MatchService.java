package com.nearconnect.backend.service;

import com.nearconnect.backend.dto.MatchView;
import com.nearconnect.backend.dto.UserView;
import com.nearconnect.backend.model.Match;
import com.nearconnect.backend.model.Message;
import com.nearconnect.backend.model.User;
import com.nearconnect.backend.repository.MatchRepository;
import com.nearconnect.backend.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class MatchService {

    private final MatchRepository matchRepository;
    private final MessageRepository messageRepository;
    private final UserService userService;

    public MatchService(MatchRepository matchRepository, MessageRepository messageRepository, UserService userService) {
        this.matchRepository = matchRepository;
        this.messageRepository = messageRepository;
        this.userService = userService;
    }

    public List<MatchView> getMatches(User currentUser) {
        return matchRepository.findByUser1OrUser2OrderByCreatedAtDesc(currentUser.getId(), currentUser.getId())
                .stream()
                .map(match -> toView(match, currentUser.getId()))
                .sorted(Comparator.comparing(MatchView::lastActivityAt).reversed())
                .toList();
    }

    public boolean areMatched(Long firstUserId, Long secondUserId) {
        long user1 = Math.min(firstUserId, secondUserId);
        long user2 = Math.max(firstUserId, secondUserId);
        return matchRepository.findByUser1AndUser2(user1, user2).isPresent();
    }

    private MatchView toView(Match match, Long currentUserId) {
        Long otherUserId = match.getUser1().equals(currentUserId) ? match.getUser2() : match.getUser1();
        User otherUser = userService.findById(otherUserId);
        List<Message> conversation = messageRepository.findConversation(currentUserId, otherUserId);
        Message lastMessage = conversation.isEmpty() ? null : conversation.get(conversation.size() - 1);
        return MatchView.of(match.getId(), UserView.from(otherUser), lastMessage, match.getCreatedAt());
    }
}
