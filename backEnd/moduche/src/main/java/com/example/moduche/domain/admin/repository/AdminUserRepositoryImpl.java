package com.example.moduche.domain.admin.repository;

import com.example.moduche.domain.login.User;
import com.example.moduche.domain.login.enums.UserStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class AdminUserRepositoryImpl implements AdminUserCustomRepository {

    @PersistenceContext
    private EntityManager em;

    // 공통 predicate 생성 메서드
    private List<Predicate> buildPredicates(
            CriteriaBuilder cb,
            Root<User> root,
            String q,
            String status,
            LocalDateTime createdFrom,
            LocalDateTime createdTo
    ) {
        List<Predicate> predicates = new ArrayList<>();

        // 관리자 역할만 조회 (role_id in (1,2))
        predicates.add(root.get("role").get("roleId").in(1L, 2L));

        // 검색어 필터
        if (StringUtils.hasText(q)) {
            String pattern = "%" + q.toLowerCase() + "%";
            predicates.add(cb.or(
                    cb.like(cb.lower(root.get("username")), pattern),
                    cb.like(cb.lower(root.get("name")), pattern),
                    cb.like(cb.lower(root.get("email")), pattern),
                    cb.like(cb.lower(root.get("phone")), pattern)
            ));
        }

        // 상태 필터
        if (StringUtils.hasText(status)) {
            try {
                UserStatus userStatus = UserStatus.valueOf(status.toUpperCase());
                predicates.add(cb.equal(root.get("status"), userStatus));
            } catch (IllegalArgumentException ignored) {
                // 잘못된 상태값은 무시
            }
        }

        // 생성일 범위 필터
        if (createdFrom != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), createdFrom));
        }
        if (createdTo != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), createdTo));
        }

        return predicates;
    }

    @Override
    public Page<User> findAdmins(String q, String status, LocalDateTime createdFrom, LocalDateTime createdTo, Pageable pageable) {
        CriteriaBuilder cb = em.getCriteriaBuilder();

        // 메인 조회 쿼리
        CriteriaQuery<User> cq = cb.createQuery(User.class);
        Root<User> root = cq.from(User.class);

        List<Predicate> predicates = buildPredicates(cb, root, q, status, createdFrom, createdTo);
        cq.where(predicates.toArray(new Predicate[0]));
        cq.orderBy(cb.desc(root.get("createdAt")));

        var query = em.createQuery(cq);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());
        List<User> users = query.getResultList();

        // 총 개수 쿼리
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<User> countRoot = countQuery.from(User.class);
        List<Predicate> countPredicates = buildPredicates(cb, countRoot, q, status, createdFrom, createdTo);
        countQuery.select(cb.count(countRoot));
        countQuery.where(countPredicates.toArray(new Predicate[0]));
        Long total = em.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(users, pageable, total);
    }
}
