package com.example.moduche.domain.myFit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.moduche.domain.myFit.entity.MyFitRecommend;
import java.util.List;
import java.util.Optional;

public interface MyFitRecommendRepository extends JpaRepository<MyFitRecommend, Long> {
	
	    @Query("SELECT r FROM MyFitRecommend r WHERE TRIM(r.troblTyNm) = :troblTyNm OR :troblTyNm IS NULL")
	    List<MyFitRecommend> findByTroblTyNm(@Param("troblTyNm") String troblTyNm);
	
	    @Query("SELECT DISTINCT r FROM MyFitRecommend r LEFT JOIN FETCH r.contents WHERE (TRIM(r.agrdeFlagNm) = :agrdeFlagNm OR :agrdeFlagNm IS NULL) " +
	           "AND (TRIM(r.sexdstnFlagCd) = :sexdstnFlagCd OR :sexdstnFlagCd IS NULL) " +
	           "AND (TRIM(r.troblTyNm) = :troblTyNm OR :troblTyNm IS NULL) " +
	           "AND (TRIM(r.troblGradNm) = :troblGradNm OR :troblGradNm IS NULL) " +
	           "ORDER BY r.rank ASC")
	    List<MyFitRecommend> findByCriteria(@Param("agrdeFlagNm") String agrdeFlagNm,
	                                        @Param("sexdstnFlagCd") String sexdstnFlagCd,
	                                        @Param("troblTyNm") String troblTyNm,
	                                        @Param("troblGradNm") String troblGradNm);

    @Query("SELECT r FROM MyFitRecommend r LEFT JOIN FETCH r.contents WHERE r.id = :id")
    Optional<MyFitRecommend> findByIdWithContents(@Param("id") Long id);
    
}
