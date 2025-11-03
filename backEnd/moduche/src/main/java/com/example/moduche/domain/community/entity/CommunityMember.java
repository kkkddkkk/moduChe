package com.example.moduche.domain.community.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.example.moduche.domain.community.enums.CommunityMemberRole;
import com.example.moduche.domain.login.User;

import lombok.*;

@Entity
@Table(name = "community_member", uniqueConstraints = @UniqueConstraint(name = "uk_comm_user", columnNames = {
		"community_id", "user_id" }))
@Getter
@Setter
@NoArgsConstructor
public class CommunityMember {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "community_id", foreignKey = @ForeignKey(name = "fk_commmember_comm"))
	private Community community;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_commmember_user"))
	private User user;

	@Enumerated(EnumType.STRING)
	private CommunityMemberRole role; // ADMIN/MANAGER/MEMBER.

	private LocalDateTime joinedAt;
}