package com.example.moduche.domain.login;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity @Table(name="user_role",
uniqueConstraints=@UniqueConstraint(name="uk_user_role", columnNames={"user_id","role_id"}))
@Getter @Setter @NoArgsConstructor
public class UserRole {
@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
private Long id;

@ManyToOne(fetch=FetchType.LAZY, optional=false)
@JoinColumn(name="user_id", foreignKey=@ForeignKey(name="fk_userrole_user"))
private User user;

@ManyToOne(fetch=FetchType.LAZY, optional=false)
@JoinColumn(name="role_id", referencedColumnName="role_id",
            foreignKey=@ForeignKey(name="fk_userrole_role"))
private Role role;

private LocalDateTime assignedAt;
}