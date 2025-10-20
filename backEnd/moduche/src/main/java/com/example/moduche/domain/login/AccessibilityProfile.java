package com.example.moduche.domain.login;

import jakarta.persistence.*;

import lombok.*;

@Entity @Table(name="accessibility_profile",
uniqueConstraints=@UniqueConstraint(name="uk_accprofile_user", columnNames={"user_id"}))
@Getter @Setter @NoArgsConstructor
public class AccessibilityProfile {
@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
private Long accId;

@OneToOne(fetch=FetchType.LAZY, optional=false)
@JoinColumn(name="user_id", foreignKey=@ForeignKey(name="fk_accprofile_user"))
private User user;

private String disablityGrade;
private String disabilityType;   // MOBILITY/HEARING/VISUAL/COGNITIVE...
private String visionSupport;
private String hearingSupport;
private String note;
}