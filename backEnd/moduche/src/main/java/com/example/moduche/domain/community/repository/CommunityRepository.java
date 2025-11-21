package com.example.moduche.domain.community.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.moduche.domain.admin.dto.FetchCommunityDTO;
import com.example.moduche.domain.community.entity.Community;
import com.example.moduche.domain.community.enums.CommunityStatus;
import com.example.moduche.domain.main.dto.CloseCommunityDTO;
import com.example.moduche.domain.main.dto.CloseFacilityDTO;
import com.example.moduche.domain.notice.dto.FetchNoticeDTO;

public interface CommunityRepository extends JpaRepository<Community, Long> {
	
	//동아리 소유주 여부 경량 반환, 작성자: 고은설.
    boolean existsByOwner_UserId(Long userId);
    
    //동아리 아이디, 유저 아이디 두개로 해당 유저가 해당 동아리 소유주인지 반환, 작성자: 고은설.
    boolean existsByCommunityIdAndOwner_UserId(Long communityId, Long ownerId);
    
    //운영자 아이디에 해당되는 소유 동아리 정보 반환, 작성자: 고은설.
    //단건.
    //Optional<Community> findByCommunityId(Long communityId);
    //목록.
    List<Community> findByOwner_UserId(Long ownerId);
    
    //김도경: 가까운 순으로 limit만큼 뽑기
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
    	List<CloseCommunityDTO> findNearby(@Param("lat") double lat,
    	                                  @Param("lng") double lng,
    	                                  @Param("limit") int limit);
    
	// 김도경: adminPage - communityList
	@Query("SELECT new com.example.moduche.domain.admin.dto.FetchCommunityDTO("+
			"c.communityId, c.name, c.createdAt, c.owner.name, c.founder, "+ 
			"c.status) " +
			"FROM Community c WHERE (:keyword IS NULL OR "+ 
			"str(c.communityId) LIKE CONCAT('%', :keyword, '%') OR " + 
			"c.name LIKE CONCAT('%', :keyword, '%') OR "+ 
			"c.founder LIKE CONCAT('%', :keyword, '%')) " + 
			"AND (:status IS NULL OR c.status = :status) ")
	Page<FetchCommunityDTO> findFetchCommunityDTOList(Pageable pageable,
			@Param("keyword") String keyword,
	        @Param("status") CommunityStatus status);
	
	//활성화 list 수
	@Query("SELECT COUNT(c) FROM Community c WHERE c.status = 'ACTIVE'")
	Long findActivedNum();
	
	//승인 신청 list 수
	@Query("SELECT COUNT(c) FROM Community c WHERE c.status = 'REGISTERED'")
	Long findRegisteredNum();
}
