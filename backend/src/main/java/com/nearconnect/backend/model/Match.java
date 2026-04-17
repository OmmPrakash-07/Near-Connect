package com.nearconnect.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long user1;
    private Long user2;
}