package org.stormsofts.billing.Repository;



import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.stormsofts.billing.model.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByShop(Shop shop);
    Optional<Sale> findByBillNo(String billNo);
    List<Sale> findByShop_ShopId(Long shopId);

    @Query("SELECT COALESCE(SUM(s.totalAmt),0) FROM Sale s WHERE s.shop = :shop AND s.saleDate = :date")
    double todaySales(@Param("shop") Shop shop, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(s.totalAmt),0) FROM Sale s WHERE s.shop = :shop AND MONTH(s.saleDate) = :month AND YEAR(s.saleDate) = :year")
    double monthlySales(@Param("shop") Shop shop, @Param("month") int month, @Param("year") int year);

    @Query("SELECT s FROM Sale s WHERE s.shop = :shop ORDER BY s.saleDate DESC")
    List<Sale> recentSales(@Param("shop") Shop shop);

    @Query("SELECT new org.stormsofts.billing.model.DailyChartDTO(s.saleDate, SUM(s.totalAmt), 0) " +
            "FROM Sale s WHERE s.shop = :shop AND s.saleDate >= :startDate GROUP BY s.saleDate ORDER BY s.saleDate")
    List<DailyChartDTO> last7DaysSales(@Param("shop") Shop shop, @Param("startDate") LocalDate startDate);

    @Query("SELECT new org.stormsofts.billing.model.MonthlyChartDTO(MONTH(s.saleDate), YEAR(s.saleDate), SUM(s.totalAmt)) " +
            "FROM Sale s WHERE s.shop = :shop AND s.saleDate >= :startDate GROUP BY YEAR(s.saleDate), MONTH(s.saleDate) ORDER BY YEAR(s.saleDate), MONTH(s.saleDate)")
    List<MonthlyChartDTO> last6MonthsSales(@Param("shop") Shop shop, @Param("startDate") LocalDate startDate);

    @Query("SELECT new org.stormsofts.billing.model.ProductChartDTO(si.product.pName, SUM(si.quantity)) " +
            "FROM SaleItem si WHERE si.sale.shop = :shop GROUP BY si.product.pName ORDER BY SUM(si.quantity) DESC")
    List<ProductChartDTO> top5SellingProducts(@Param("shop") Shop shop, Pageable pageable);




    @Query("SELECT SUM(s.totalAmt) FROM Sale s WHERE s.saleDate = :date")
    Double sumTotalAmountByDate(@Param("date") LocalDate date);

    @Query("SELECT SUM(s.totalAmt) FROM Sale s WHERE s.saleDate BETWEEN :startDate AND :endDate")
    Double sumTotalAmountByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("""
    SELECT new org.stormsofts.billing.model.ShopRecentSaleDTO(
        s.shop.shopName,
        s.billNo,
        s.totalAmt
    )
    FROM Sale s
    ORDER BY s.saleDate DESC
""")
    List<ShopRecentSaleDTO> findRecentSalesGroupedByShop();


    @Query("""
SELECT new org.stormsofts.billing.model.ShopSalesSummaryDTO(
    s.shop.shopName,
    SUM(s.totalAmt)
)
FROM Sale s
GROUP BY s.shop.shopName
ORDER BY SUM(s.totalAmt) DESC
""")
    List<ShopSalesSummaryDTO> findTopShopsBySales(Pageable pageable);

}
