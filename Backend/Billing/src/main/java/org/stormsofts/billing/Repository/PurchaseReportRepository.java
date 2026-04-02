package org.stormsofts.billing.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.stormsofts.billing.model.*;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PurchaseReportRepository extends JpaRepository<Purchase, Long> {

    // Daily
    @Query("""
    SELECT new org.stormsofts.billing.model.DailyPurchaseReportDTO(
        p.purchaseDate,
        COUNT(DISTINCT p.purId),
        SUM(pi.quantity),
        SUM(pi.purchasePrice * pi.quantity),
        SUM(pi.purchasePrice * pi.quantity * pi.gstRate / 200),
        SUM(pi.purchasePrice * pi.quantity * pi.gstRate / 200),
        SUM(pi.totalAmount),
        p.shop.shopId
    )
    FROM Purchase p
    JOIN p.purchaseItems pi
    WHERE p.purchaseDate BETWEEN :fromDate AND :toDate
      AND p.shop = :shop
    GROUP BY p.purchaseDate, p.shop.shopId
    ORDER BY p.purchaseDate
    """)
    List<DailyPurchaseReportDTO> getDailyPurchaseReport(
            @Param("shop") Shop shop,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );

    // Monthly
    @Query("""
SELECT new org.stormsofts.billing.model.MonthlyPurchaseReportDTO(
    YEAR(p.purchaseDate),
    MONTH(p.purchaseDate),
    COUNT(DISTINCT p.purId),
    SUM(pi.quantity),
    SUM(pi.purchasePrice * pi.quantity),
    SUM(pi.purchasePrice * pi.quantity * pi.gstRate / 200),
    SUM(pi.purchasePrice * pi.quantity * pi.gstRate / 200),
    SUM(pi.totalAmount),
    p.shop.shopId
)
FROM Purchase p
JOIN p.purchaseItems pi
WHERE p.purchaseDate BETWEEN :fromDate AND :toDate
  AND p.shop = :shop
GROUP BY YEAR(p.purchaseDate), MONTH(p.purchaseDate), p.shop.shopId
ORDER BY YEAR(p.purchaseDate), MONTH(p.purchaseDate)
""")
    List<MonthlyPurchaseReportDTO> getMonthlyPurchaseReport(
            @Param("shop") Shop shop,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );


    // Product-wise
    @Query("""
SELECT new org.stormsofts.billing.model.ProductWisePurchaseReportDTO(
    pi.product.PId,
    pi.product.pName,

    COUNT(DISTINCT p.purId),
    SUM(pi.quantity),

    SUM(pi.purchasePrice * pi.quantity),
    SUM(pi.purchasePrice * pi.quantity * pi.gstRate / 200),
    SUM(pi.purchasePrice * pi.quantity * pi.gstRate / 200),
    SUM(pi.totalAmount),

    p.shop.shopId
)
FROM Purchase p
JOIN p.purchaseItems pi
WHERE p.purchaseDate BETWEEN :fromDate AND :toDate
  AND p.shop = :shop
GROUP BY pi.product.PId, pi.product.pName, p.shop.shopId
""")
    List<ProductWisePurchaseReportDTO> getProductWisePurchaseReport(
            @Param("shop") Shop shop,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );


    // Supplier-wise
    @Query("""
SELECT new org.stormsofts.billing.model.SupplierWisePurchaseReportDTO(
    p.supplier.supId,
    p.supplier.supName,

    COUNT(DISTINCT p.purId),
    SUM(pi.quantity),

    SUM(pi.purchasePrice * pi.quantity),
    SUM(pi.purchasePrice * pi.quantity * pi.gstRate / 200),
    SUM(pi.purchasePrice * pi.quantity * pi.gstRate / 200),
    SUM(pi.totalAmount),

    p.shop.shopId
)
FROM Purchase p
JOIN p.purchaseItems pi
WHERE p.purchaseDate BETWEEN :fromDate AND :toDate
  AND p.shop = :shop
GROUP BY p.supplier.supId, p.supplier.supName, p.shop.shopId
""")
    List<SupplierWisePurchaseReportDTO> getSupplierWisePurchaseReport(
            @Param("shop") Shop shop,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );

}
