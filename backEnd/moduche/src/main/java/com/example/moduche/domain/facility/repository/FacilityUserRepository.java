package com.example.moduche.domain.facility.repository;

import com.example.moduche.domain.facility.FacilityUser;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FacilityUserRepository extends JpaRepository<FacilityUser, Long> {

    /** 시설별 활성 사용자 중 역할 우선순위(OWNER > MANAGER > STAFF)로 정렬해서 반환 */
    @Query("""
        select fu
        from FacilityUser fu
        join fetch fu.user u
        where fu.facility.facilityId = :facilityId
          and (fu.isActive = true or fu.isActive is null)
        order by case fu.roleInFac
                   when 'OWNER' then 0
                   when 'MANAGER' then 1
                   when 'STAFF' then 2
                   else 3
                 end,
                 fu.joinedAt asc,
                 u.name asc
        """)
    List<FacilityUser> findActiveByFacilityOrderByRole(@Param("facilityId") Long facilityId);
}
