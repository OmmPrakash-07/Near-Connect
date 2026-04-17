package com.nearconnect.backend.controller;

import com.nearconnect.backend.model.Message;
import com.nearconnect.backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public Message sendMessage(@RequestBody Message message) {
        return messageService.sendMessage(message);
    }

    @GetMapping("/chat")
    public List<Message> getChat(
            @RequestParam Long user1,
            @RequestParam Long user2
    ) {
        return messageService.getChat(user1, user2);
    }
}