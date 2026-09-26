package com.v1krant.order.service;

import com.v1krant.order.client.ProductClient;
import com.v1krant.order.dto.CreateOrderRequest;
import com.v1krant.order.dto.OrderResponse;
import com.v1krant.order.dto.ProductDto;
import com.v1krant.order.entity.Order;
import com.v1krant.order.entity.OrderItem;
import com.v1krant.order.repository.OrderRepository;
import feign.FeignException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductClient productClient;

    public OrderService(OrderRepository orderRepository, ProductClient productClient) {
        this.orderRepository = orderRepository;
        this.productClient = productClient;
    }

    @Transactional
    public OrderResponse create(String username, CreateOrderRequest request) {
        Order order = new Order();
        order.setUsername(username);
        order.setStatus(Order.Status.CREATED);

        BigDecimal total = BigDecimal.ZERO;
        for (CreateOrderRequest.OrderItemRequest itemRequest : request.items()) {
            ProductDto product;
            try {
                product = productClient.getProduct(itemRequest.productId());
            } catch (FeignException.NotFound ex) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Product not found: " + itemRequest.productId());
            } catch (FeignException ex) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Product service unavailable");
            }

            try {
                productClient.reserveStock(itemRequest.productId(), Map.of("quantity", itemRequest.quantity()));
            } catch (FeignException.BadRequest ex) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Insufficient stock for product: " + product.name());
            } catch (FeignException ex) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Failed to reserve stock");
            }

            OrderItem item = new OrderItem();
            item.setProductId(product.id());
            item.setProductName(product.name());
            item.setQuantity(itemRequest.quantity());
            item.setUnitPrice(product.price());
            order.addItem(item);

            total = total.add(product.price().multiply(BigDecimal.valueOf(itemRequest.quantity())));
        }

        order.setTotalAmount(total);
        order.setStatus(Order.Status.CONFIRMED);
        return toResponse(orderRepository.save(order));
    }

    public List<OrderResponse> findByUsername(String username) {
        return orderRepository.findByUsernameOrderByCreatedAtDesc(username).stream()
                .map(this::toResponse)
                .toList();
    }

    public OrderResponse findById(Long id) {
        return toResponse(orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found")));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderResponse.ItemResponse> items = order.getItems().stream()
                .map(item -> new OrderResponse.ItemResponse(
                        item.getProductId(),
                        item.getProductName(),
                        item.getQuantity(),
                        item.getUnitPrice()))
                .toList();
        return new OrderResponse(
                order.getId(),
                order.getUsername(),
                order.getStatus().name(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                items);
    }
}
