package com.example.moduche.domain.community.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.example.moduche.domain.community.enums.CommunityMemberRole;
import com.example.moduche.domain.community.enums.CommunityMemberStatus;
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

	private String contact;     //연락처.
	
	@Enumerated(EnumType.STRING)	//회원 등급.
	private CommunityMemberRole role; // ADMIN/MANAGER/MEMBER.
	
	@Enumerated(EnumType.STRING)	//회원 상태.
	private CommunityMemberStatus status; // ACTIVE/QUIT/SUSPENDED.

	private LocalDateTime joinedAt;
	
	
    private LocalDateTime suspendedAt; //정지날짜.
    private LocalDateTime quitAt;		//탈퇴날짜.

    @Column(length = 255)
    private String suspendReason;	//정지 사유.

    @Column(length = 255)
    private String quitReason;		//탈퇴 사유.
}