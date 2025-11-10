package com.example.moduche.domain.login;

import jakarta.persistence.*;

import lombok.*;

@Entity @Table(name="disability")
@Getter @Setter @NoArgsConstructor
@Builder @AllArgsConstructor
public class Disability {
@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
private Long disabilityId;
private String disabilityCode;   //장애명

}