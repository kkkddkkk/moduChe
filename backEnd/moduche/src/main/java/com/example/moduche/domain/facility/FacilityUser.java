package com.example.moduche.domain.facility;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.example.moduche.domain.login.User;

import lombok.*;

@Entity @Table(name="facility_user",
uniqueConstraints=@UniqueConstraint(name="uk_fac_user", columnNames={"facility_id","user_id"}))
@Getter @Setter @NoArgsConstructor
public class FacilityUser {
@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
private Long id;

@ManyToOne(fetch=FetchType.LAZY, optional=false)
@JoinColumn(name="facility_id", foreignKey=@ForeignKey(name="fk_facuser_facility"))
private Facility facility;

@ManyToOne(fetch=FetchType.LAZY, optional=false)
@JoinColumn(name="user_id", foreignKey=@ForeignKey(name="fk_facuser_user"))
private User user;

private String roleInFac;     // OWNER/MANAGER/STAFF
private Boolean isActive;
private LocalDateTime joinedAt;
}