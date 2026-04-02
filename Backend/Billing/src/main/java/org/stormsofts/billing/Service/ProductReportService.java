package org.stormsofts.billing.Service;

import org.stormsofts.billing.model.ProductWiseSalesReportDTO;
import org.stormsofts.billing.model.Shop;

import java.time.LocalDate;
import java.util.List;

public interface ProductReportService {
    List<ProductWiseSalesReportDTO> getProductWiseSales(Shop shop, LocalDate fromDate, LocalDate toDate);
}
