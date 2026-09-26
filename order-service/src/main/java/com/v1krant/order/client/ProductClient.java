package com.v1krant.order.client;

import com.v1krant.order.dto.ProductDto;
import java.util.Map;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "product-service")
public interface ProductClient {

    @GetMapping("/api/products/{id}")
    ProductDto getProduct(@PathVariable("id") Long id);

    @PostMapping("/api/products/{id}/reserve")
    ProductDto reserveStock(@PathVariable("id") Long id, @RequestBody Map<String, Integer> body);
}
