package com.example.moduche.domain.admin.specification;

import com.example.moduche.domain.login.User;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class AdminUserSpecification {

    public static Specification<User> hasRoleIds(Long... roleIds) {
        return (root, query, cb) -> root.get("role").get("roleId").in((Object[]) roleIds);
    }

    public static Specification<User> nameEmailUsernamePhoneLike(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return null;
            String pattern = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), pattern),
                    cb.like(cb.lower(root.get("email")), pattern),
                    cb.like(cb.lower(root.get("username")), pattern),
                    cb.like(cb.lower(root.get("phone")), pattern)
            );
        };
    }

    public static Specification<User> hasStatus(String status) {
        return (root, query, cb) -> {
            if (status == null || status.isBlank()) return null;
            return cb.equal(root.get("status"), status);
        };
    }

    public static Specification<User> createdAfter(LocalDateTime from) {
        return (root, query, cb) -> {
            if (from == null) return null;
            return cb.greaterThanOrEqualTo(root.get("createdAt"), from);
        };
    }

    public static Specification<User> createdBefore(LocalDateTime to) {
        return (root, query, cb) -> {
            if (to == null) return null;
            return cb.lessThanOrEqualTo(root.get("createdAt"), to);
        };
    }
}
