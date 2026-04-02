package org.stormsofts.billing.Service;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.billing.Repository.ProductSalesReportRepository;
import org.stormsofts.billing.model.ProductWiseSalesReportDTO;
import org.stormsofts.billing.model.Shop;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductReportServiceImpl implements ProductReportService{

    @Autowired
    private  ProductSalesReportRepository repository;

    @Override
    public List<ProductWiseSalesReportDTO> getProductWiseSales(Shop shop, LocalDate fromDate, LocalDate toDate) {
        return repository.getProductWiseSales(shop, fromDate, toDate);
    }
}
