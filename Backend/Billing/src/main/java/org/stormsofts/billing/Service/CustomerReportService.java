package org.stormsofts.billing.Service;

import org.springframework.stereotype.Repository;
import org.stormsofts.billing.model.CustomerWiseSalesReportDTO;
import org.stormsofts.billing.model.Shop;

import java.time.LocalDate;
import java.util.List;


public interface CustomerReportService {
    List<CustomerWiseSalesReportDTO> getCustomerWiseSales(Shop shop, LocalDate fromDate, LocalDate toDate);
}
