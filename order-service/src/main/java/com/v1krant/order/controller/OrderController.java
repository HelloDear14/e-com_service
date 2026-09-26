package com.v1krant.order.controller;

import com.v1krant.order.dto.CreateOrderRequest;
import com.v1krant.order.dto.OrderResponse;
import com.v1krant.order.service.OrderService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(
            @RequestHeader(value = "X-User-Name", required = false) String username,
            @Valid @RequestBody CreateOrderRequest request) {
        String resolvedUser = requireUsername(username);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.create(resolvedUser, request));
    }

    @GetMapping
    public List<OrderResponse> myOrders(
            @RequestHeader(value = "X-User-Name", required = false) String username) {
        return orderService.findByUsername(requireUsername(username));
    }

    @GetMapping("/{id}")
    public OrderResponse get(@PathVariable Long id) {
        return orderService.findById(id);
    }

    private String requireUsername(String username) {
        if (username == null || username.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing authenticated user");
        }
        return username;
    }
}
