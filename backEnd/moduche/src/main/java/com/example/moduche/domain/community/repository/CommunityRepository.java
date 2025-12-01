package com.example.moduche.domain.community.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.moduche.domain.admin.dto.FetchCommunityDTO;
import com.example.moduche.domain.admin.dto.FetchCommunityDetailDTO;
import com.example.moduche.domain.community.dto.CommunityAddressDTO;
import com.example.moduche.domain.community.entity.Community;
import com.example.moduche.domain.community.enums.CommunityStatus;
import com.example.moduche.domain.main.dto.CloseCommunityDTO;

public interface CommunityRepository extends JpaRepository<Community, Long> {

    // 동아리 소유주 여부 확인
    boolean existsByOwner_UserId(Long userId);

    // 특정 동아리의 소유주 여부 확인
    boolean existsByCommunityIdAndOwner_UserId(Long communityId, Long ownerId);

    // 특정 사용자 소유 동아리 목록
    List<Community> findByOwner_UserId(Long ownerId);

    // 가까운 동아리 가져오기
    @Query(value = """
            SELECT c.community_id AS communityId,
                   c.name AS name,
                   c.founder AS founder,
                   c.purpose AS purpose,
                   c.schedule_detail AS scheduleDetail,
                   c.geo_lat AS geoLat,
                   c.geo_lng AS geoLng,
                   (6371000 * acos(
                       cos(radians(:lat)) * cos(radians(c.geo_lat)) *
                       cos(radians(c.geo_lng) - radians(:lng)) +
                       sin(radians(:lat)) * sin(radians(c.geo_lat))
                   )) AS distance
            FROM moduche.community c
            WHERE c.status = 'ACTIVE'
            ORDER BY distance ASC
            LIMIT :limit
        """, nativeQuery = true)
    List<CloseCommunityDTO> findNearby(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("limit") int limit);

    // AdminPage - Community List 조회
    @Query("""
            SELECT new com.example.moduche.domain.admin.dto.FetchCommunityDTO(
                c.communityId, c.name, c.createdAt, fu.roleInFac, c.founder, c.status
            )
            FROM Community c
                JOIN c.owner u
                JOIN FacilityUser fu ON fu.user = u
            WHERE (:keyword IS NULL OR
                   str(c.communityId) LIKE CONCAT('%', :keyword, '%') OR
                   c.name LIKE CONCAT('%', :keyword, '%') OR
                   c.founder LIKE CONCAT('%', :keyword, '%'))
              AND (:status IS NULL OR c.status = :status)
        """)
    Page<FetchCommunityDTO> findFetchCommunityDTOList(
            Pageable pageable,
            @Param("keyword") String keyword,
            @Param("status") CommunityStatus status);

    // 활성화된 동아리 수
    @Query("SELECT COUNT(c) FROM Community c WHERE c.status = 'ACTIVE'")
    Long findActivedNum();

    // 승인 신청된 동아리 수
    @Query("SELECT COUNT(c) FROM Community c WHERE c.status = 'REGISTERED'")
    Long findRegisteredNum();

    // 전체 동아리 수
    @Query("SELECT COUNT(c) FROM Community c")
    Long findCommunityNum();

    // AdminPage - Community 상세 조회
    @Query("""
            SELECT new com.example.moduche.domain.admin.dto.FetchCommunityDetailDTO(
                c.communityId, c.name, c.purpose, c.founder, fu.roleInFac, u.phone,
                c.status, cp.postId, cp.title
            )
            FROM Community c
                JOIN c.owner u
                JOIN FacilityUser fu ON fu.user = u
                JOIN CommunityPost cp ON cp.community = c
            WHERE c.communityId = :communityId
        """)
    Optional<FetchCommunityDetailDTO> findFetchCommunityDetailDTO(
            @Param("communityId") Long communityId);

    // 주소 조회
    @Query("""
            SELECT new com.example.moduche.domain.community.dto.CommunityAddressDTO(
                c.address, c.addressDetail
            )
            FROM Community c
            WHERE c.communityId = :communityId
        """)
    Optional<CommunityAddressDTO> findCommunityAddress(
            @Param("communityId") Long communityId);

    // ⬇ Stashed changes 에 있던 추가 메서드 유지
    @Query("""
            SELECT COUNT(c)
            FROM Community c
            WHERE c.status = com.example.moduche.domain.community.enums.CommunityStatus.REGISTERED
        """)
    Long countPendingClubs();
}
