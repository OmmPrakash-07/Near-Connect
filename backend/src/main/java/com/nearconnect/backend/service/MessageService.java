package com.nearconnect.backend.service;

import com.nearconnect.backend.model.Message;
import com.nearconnect.backend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message sendMessage(Message message) {
        return messageRepository.save(message);
    }

    public List<Message> getChat(Long user1, Long user2) {

        List<Message> chat1 = messageRepository.findBySenderIdAndReceiverId(user1, user2);
        List<Message> chat2 = messageRepository.findBySenderIdAndReceiverId(user2, user1);

        chat1.addAll(chat2);

        chat1.sort((a, b) -> a.getTimestamp().compareTo(b.getTimestamp()));

        return chat1;
    }
}