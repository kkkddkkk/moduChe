package com.example.moduche.global;

import lombok.Data;

// 응답 포맷 표준화 (ApiResponse, ErrorCode 등)

@Data
public class Response {
    private StatusEnum status;
    private String message;
    private Object data;

    public Response(StatusEnum status, String message, Object object) {
        this.status = status;
        this.data = object;
        this.message = message;
    }
}
