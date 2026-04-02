package org.stormsofts.billing.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.stormsofts.billing.model.Product;
import org.stormsofts.billing.model.Shop;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByShop(Shop shop);

//    List<Product> findByPNameContainingIgnoreCaseAndShop(String pName, Shop shop);
    @Query("SELECT COUNT(p) FROM Product p WHERE p.shop = :shop")
    long countByShop(@Param("shop") Shop shop);


    @Query("SELECT p FROM Product p " +
            "WHERE p.shop = :shop AND (" +
            "LOWER(p.pName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.masterCategory.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.mainCategory.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.subCategory.name) LIKE LOWER(CONCAT('%', :keyword, '%'))" +
            ")")
    List<Product> searchByNameOrCategory(@Param("keyword") String keyword, @Param("shop") Shop shop);

}
