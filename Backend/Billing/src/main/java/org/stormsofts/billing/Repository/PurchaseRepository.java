package org.stormsofts.billing.Repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.stormsofts.billing.model.DailyChartDTO;
import org.stormsofts.billing.model.Purchase;
import org.stormsofts.billing.model.Shop;
import org.stormsofts.billing.model.ShopRecentPurchaseDTO;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findBySupplier_SupNameContainingIgnoreCase(String name);
    List<Purchase> findByShop(Shop shop);
    List<Purchase> findByShop_ShopId(Long shopId);
    @Query("""
    SELECT DISTINCT p FROM Purchase p
    JOIN p.supplier s
    LEFT JOIN p.purchaseItems i
    LEFT JOIN i.product pr
    WHERE p.shop = :shop
    AND (
        LOWER(s.supName) LIKE LOWER(CONCAT('%', :key, '%'))
        OR LOWER(pr.pName) LIKE LOWER(CONCAT('%', :key, '%'))
        OR LOWER(i.batchNo) LIKE LOWER(CONCAT('%', :key, '%'))
    )
    """)
    List<Purchase> search(@Param("shop") Shop shop,
                          @Param("key") String key);
    @Query("SELECT COALESCE(SUM(p.totalAmt),0) FROM Purchase p WHERE p.shop = :shop AND p.purchaseDate = :date")
    double todayPurchase(@Param("shop") Shop shop, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(p.totalAmt),0) FROM Purchase p WHERE p.shop = :shop AND MONTH(p.purchaseDate) = :month AND YEAR(p.purchaseDate) = :year")
    double monthlyPurchase(@Param("shop") Shop shop, @Param("month") int month, @Param("year") int year);

    @Query("SELECT p FROM Purchase p WHERE p.shop = :shop ORDER BY p.purchaseDate DESC")
    List<Purchase> recentPurchases(@Param("shop") Shop shop);

    @Query("SELECT new org.stormsofts.billing.model.DailyChartDTO(p.purchaseDate, 0, SUM(p.totalAmt)) " +
            "FROM Purchase p WHERE p.shop = :shop AND p.purchaseDate >= :startDate GROUP BY p.purchaseDate ORDER BY p.purchaseDate")
    List<DailyChartDTO> last7DaysPurchase(@Param("shop") Shop shop, @Param("startDate") LocalDate startDate);



    @Query("SELECT SUM(p.totalAmt) FROM Purchase p WHERE p.purchaseDate = :date")
    Double sumTotalAmountByDate(@Param("date") LocalDate date);

    @Query("SELECT SUM(p.totalAmt) FROM Purchase p WHERE p.purchaseDate BETWEEN :startDate AND :endDate")
    Double sumTotalAmountByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT new org.stormsofts.billing.model.ShopRecentPurchaseDTO(p.shop.shopName, p.supplier.supName, p.totalAmt) " +
            "FROM Purchase p ORDER BY p.purchaseDate DESC")
    List<ShopRecentPurchaseDTO> findRecentPurchasesGroupedByShop();

}

