package org.stormsofts.billing.Repository;


import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.stormsofts.billing.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Long> {
    Optional<Stock> findByProduct(Product product);
    Stock findByProduct_PId(Long productId);
    Optional<Stock> findByProductAndSize(Product product, SizeMaster size);
    Optional<Stock> findByShopAndProductAndSize(
            Shop shop,
            Product product,
            SizeMaster size
    );

    List<Stock> findByShop(Shop shop);
    List<Stock> findByShop_ShopId(Long shopId);

    @Query("SELECT COUNT(s) FROM Stock s WHERE s.shop = :shop AND s.quantity <= :threshold")
    long lowStockCount(@Param("shop") Shop shop, @Param("threshold") double threshold);

    @Query("SELECT s FROM Stock s WHERE s.shop = :shop AND s.quantity <= :threshold")
    List<Stock> lowStockProducts(@Param("shop") Shop shop, @Param("threshold") double threshold);

    @Query("""
SELECT new org.stormsofts.billing.model.ShopLowStockDTO(
    s.shop.shopName,
    s.product.pName,
    s.quantity
)
FROM Stock s
WHERE s.quantity < :threshold
ORDER BY s.shop.shopName
""")
    List<ShopLowStockDTO> findLowStockGroupedByShop(@Param("threshold") Double threshold);


}

