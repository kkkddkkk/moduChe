package com.example.moduche.global;

public enum StatusEnum {

    // 2xx: 성공
    OK(200, "OK"),
    CREATED(201, "CREATED"),
    NO_CONTENT(204, "NO_CONTENT"),

    // 3xx: 리다이렉션
    MOVED_PERMANENTLY(301, "MOVED_PERMANENTLY"),
    FOUND(302, "FOUND"),
    NOT_MODIFIED(304, "NOT_MODIFIED"),

    // 4xx: 클라이언트 오류
    BAD_REQUEST(400, "BAD_REQUEST"),
    UNAUTHORIZED(401, "UNAUTHORIZED"),
    FORBIDDEN(403, "FORBIDDEN"),
    NOT_FOUND(404, "NOT_FOUND"),
    CONFLICT(409, "CONFLICT"),
    UNPROCESSABLE_ENTITY(422, "UNPROCESSABLE_ENTITY"),

    // 5xx: 서버 오류
    INTERNAL_SERVER_ERROR(500, "INTERNAL_SERVER_ERROR"),
    SERVICE_UNAVAILABLE(503, "SERVICE_UNAVAILABLE");

    private final int code;
    private final String message;

    StatusEnum(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}