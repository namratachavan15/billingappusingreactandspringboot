package org.stormsofts.billing.Repository;



import org.springframework.stereotype.Repository;
import org.stormsofts.billing.model.ProductWiseSalesReportDTO;
import org.stormsofts.billing.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.stormsofts.billing.model.Shop;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProductSalesReportRepository
        extends JpaRepository<Sale, Long> {
    @Query("""
    SELECT new org.stormsofts.billing.model.ProductWiseSalesReportDTO(
        p.PId,
        p.pName,
        SUM(si.quantity),
        SUM(si.taxableAmount),
        SUM(si.cgstAmount),
        SUM(si.sgstAmount),
        SUM(si.totalAmount),
        s.shop.shopId
    )
    FROM Sale s
    JOIN s.saleItems si
    JOIN si.product p
    WHERE s.saleDate BETWEEN :fromDate AND :toDate
      AND s.shop = :shop
    GROUP BY p.PId, p.pName, s.shop.shopId
    ORDER BY p.pName
""")
    List<ProductWiseSalesReportDTO> getProductWiseSales(
            @Param("shop") Shop shop,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );



}
