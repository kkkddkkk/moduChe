package com.example.moduche.domain.community.dto;

import java.time.LocalDateTime;

import com.example.moduche.domain.community.enums.CommunityMemberRole;
import com.example.moduche.domain.community.enums.CommunityMemberStatus;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MemberManageDTO {
    private Long memberId;
    private String name;
    private CommunityMemberRole role;
    private CommunityMemberStatus status;
    private LocalDateTime joinedAt;
    
    private LocalDateTime suspendedAt;
    private LocalDateTime quitAt;
    
    private String suspendReason;
    private String quitReason;
}