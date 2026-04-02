package org.stormsofts.billing.Repository;


import org.springframework.stereotype.Repository;
import org.stormsofts.billing.model.DailySalesReportDTO;
import org.stormsofts.billing.model.MonthlySalesReportDTO;
import org.stormsofts.billing.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.stormsofts.billing.model.Shop;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SaleReportRepository extends JpaRepository<Sale, Long> {

    @Query("""
SELECT new org.stormsofts.billing.model.DailySalesReportDTO(
    s.saleDate,
    COUNT(DISTINCT s.saleId),
    SUM(si.quantity),
    SUM(si.taxableAmount),
    SUM(si.cgstAmount),
    SUM(si.sgstAmount),
    SUM(si.totalAmount),
    s.shop.shopId
)
FROM Sale s
JOIN s.saleItems si
WHERE s.saleDate BETWEEN :fromDate AND :toDate
  AND s.shop = :shop
GROUP BY s.saleDate, s.shop.shopId
ORDER BY s.saleDate
""")
    List<DailySalesReportDTO> getDailySalesReport(
            @Param("shop") Shop shop,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );


    @Query("""
SELECT new org.stormsofts.billing.model.MonthlySalesReportDTO(
    CAST(FUNCTION('YEAR', s.saleDate) AS integer),
    CAST(FUNCTION('MONTH', s.saleDate) AS integer),
    COUNT(DISTINCT s.saleId),
    SUM(si.quantity),
    SUM(si.taxableAmount),
    SUM(si.cgstAmount),
    SUM(si.sgstAmount),
    SUM(si.totalAmount),
    s.shop.shopId
)
FROM Sale s
JOIN s.saleItems si
WHERE s.saleDate BETWEEN :fromDate AND :toDate
  AND s.shop = :shop
GROUP BY FUNCTION('YEAR', s.saleDate), FUNCTION('MONTH', s.saleDate), s.shop.shopId
ORDER BY FUNCTION('YEAR', s.saleDate), FUNCTION('MONTH', s.saleDate)
""")
    List<MonthlySalesReportDTO> getMonthlySales(
            @Param("shop") Shop shop,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );



}
