package com.nearconnect.backend.service;

import com.nearconnect.backend.dto.MessageRequest;
import com.nearconnect.backend.exception.ApiException;
import com.nearconnect.backend.model.Message;
import com.nearconnect.backend.model.User;
import com.nearconnect.backend.repository.MessageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final MatchService matchService;
    private final UserService userService;

    public MessageService(MessageRepository messageRepository, MatchService matchService, UserService userService) {
        this.messageRepository = messageRepository;
        this.matchService = matchService;
        this.userService = userService;
    }

    @Transactional
    public Message sendMessage(User sender, MessageRequest request) {
        if (request.receiverId() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Choose a connection to message.");
        }
        userService.findById(request.receiverId());
        requireMatch(sender.getId(), request.receiverId());
        String body = request.message() == null ? "" : request.message().trim();
        if (body.isEmpty() || body.length() > 1000) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Message must be between 1 and 1000 characters.");
        }

        Message message = new Message();
        message.setSenderId(sender.getId());
        message.setReceiverId(request.receiverId());
        message.setMessage(body);
        return messageRepository.save(message);
    }

    public List<Message> getConversation(User currentUser, Long otherUserId) {
        if (otherUserId == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Choose a connection to view messages.");
        }
        requireMatch(currentUser.getId(), otherUserId);
        return messageRepository.findConversation(currentUser.getId(), otherUserId);
    }

    private void requireMatch(Long firstUserId, Long secondUserId) {
        if (!matchService.areMatched(firstUserId, secondUserId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You can only message mutual connections.");
        }
    }
}
