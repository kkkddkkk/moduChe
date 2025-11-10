package com.example.moduche.domain.login;

import jakarta.persistence.*;

import lombok.*;

@Entity @Table(name="accessibility_profile",
uniqueConstraints=@UniqueConstraint(name="uk_accprofile_user", columnNames={"user_id"}))
@Getter @Setter @NoArgsConstructor
@Builder @AllArgsConstructor
public class AccessibilityProfile {
@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
private Long accId;

@OneToOne(fetch=FetchType.LAZY, optional=false)
@JoinColumn(name="user_id", foreignKey=@ForeignKey(name="fk_accprofile_user"))
private User user;

private String disabilityGrade;
private String note;

private String birth;//김도경 추가. 주민번호 앞자리
private String gender;//김도경 추가. 주민번호 뒷자리(1자리)
private boolean qualified;//김도경 추가. 장애인 등록 여부

@ManyToOne(fetch = FetchType.LAZY, optional = false)
@JoinColumn(name = "disability_id", referencedColumnName = "disabilityId")
private Disability disability;
}