package org.stormsofts.billing.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.stormsofts.billing.model.ProfitLossDTO;
import org.stormsofts.billing.model.Product;
import org.stormsofts.billing.model.Shop;

import java.util.List;

@Repository
public interface ProfitLossRepository extends JpaRepository<Product, Long> {

    @Query("""
        SELECT new org.stormsofts.billing.model.ProfitLossDTO(
            p.pName,
            COALESCE(SUM(pi.purchasePrice * pi.quantity), 0),
            COALESCE(SUM(si.unitPriceWithGst * si.quantity), 0),
            COALESCE(SUM(si.unitPriceWithGst * si.quantity), 0) - COALESCE(SUM(pi.purchasePrice * pi.quantity), 0),
            CASE WHEN COALESCE(SUM(si.unitPriceWithGst * si.quantity),0) = 0 THEN 0
                 ELSE ((COALESCE(SUM(si.unitPriceWithGst * si.quantity),0) - COALESCE(SUM(pi.purchasePrice * pi.quantity),0)) / COALESCE(SUM(si.unitPriceWithGst * si.quantity),0)) * 100
            END
        )
        FROM Product p
        LEFT JOIN PurchaseItem pi ON pi.product = p AND pi.purchase.shop = :shop
        LEFT JOIN SaleItem si ON si.product = p AND si.sale.shop = :shop
        WHERE p.shop = :shop
        GROUP BY p.pName
    """)
    List<ProfitLossDTO> findProfitLossByShop(@Param("shop") Shop shop);
}
