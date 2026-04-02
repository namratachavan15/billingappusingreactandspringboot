package org.stormsofts.billing.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.stormsofts.billing.model.Customer;
import org.stormsofts.billing.model.CustomerWiseSalesReportDTO;
import org.stormsofts.billing.model.Shop;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CustomerSalesReportRepository extends JpaRepository<Customer, Long> {

    @Query("""
SELECT new org.stormsofts.billing.model.CustomerWiseSalesReportDTO(
    c.id,
    c.name,
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
JOIN s.customer c
WHERE s.saleDate BETWEEN :fromDate AND :toDate
  AND s.shop = :shop
GROUP BY c.id, c.name, s.shop.shopId
ORDER BY c.name
""")
    List<CustomerWiseSalesReportDTO> getCustomerWiseSales(
            @Param("shop") Shop shop,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );
}
