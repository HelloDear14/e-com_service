package com.v1krant.product.config;

import com.v1krant.product.entity.Product;
import com.v1krant.product.repository.ProductRepository;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner seedProducts(ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() > 0) {
                return;
            }
            Product laptop = new Product();
            laptop.setName("Wireless Headphones");
            laptop.setDescription("Noise-cancelling over-ear headphones");
            laptop.setPrice(new BigDecimal("149.99"));
            laptop.setStock(50);
            laptop.setCategory("Electronics");

            Product shoes = new Product();
            shoes.setName("Running Shoes");
            shoes.setDescription("Lightweight daily trainers");
            shoes.setPrice(new BigDecimal("89.50"));
            shoes.setStock(100);
            shoes.setCategory("Footwear");

            Product mug = new Product();
            mug.setName("Ceramic Mug");
            mug.setDescription("350ml matte ceramic mug");
            mug.setPrice(new BigDecimal("12.00"));
            mug.setStock(200);
            mug.setCategory("Home");

            productRepository.save(laptop);
            productRepository.save(shoes);
            productRepository.save(mug);
        };
    }
}
