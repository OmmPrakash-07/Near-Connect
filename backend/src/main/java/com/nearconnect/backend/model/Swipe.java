package com.nearconnect.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Swipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long targetUserId;
    private String action;
}