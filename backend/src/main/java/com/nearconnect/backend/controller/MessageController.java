package com.nearconnect.backend.controller;

import com.nearconnect.backend.dto.MessageRequest;
import com.nearconnect.backend.model.Message;
import com.nearconnect.backend.service.AuthService;
import com.nearconnect.backend.service.MessageService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final AuthService authService;

    public MessageController(MessageService messageService, AuthService authService) {
        this.messageService = messageService;
        this.authService = authService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Message sendMessage(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody MessageRequest request) {
        return messageService.sendMessage(authService.requireUser(authorization), request);
    }

    @GetMapping
    public List<Message> getConversation(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestParam Long withUserId) {
        return messageService.getConversation(authService.requireUser(authorization), withUserId);
    }
}
