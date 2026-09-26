package com.v1krant.order.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        String username,
        String status,
        BigDecimal totalAmount,
        Instant createdAt,
        List<ItemResponse> items
) {
    public record ItemResponse(
            Long productId,
            String productName,
            Integer quantity,
            BigDecimal unitPrice
    ) {
    }
}
