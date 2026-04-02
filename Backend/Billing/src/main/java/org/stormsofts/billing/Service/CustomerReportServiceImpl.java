package org.stormsofts.billing.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.billing.Repository.CustomerSalesReportRepository;
import org.stormsofts.billing.model.CustomerWiseSalesReportDTO;
import org.stormsofts.billing.model.Shop;

import java.time.LocalDate;
import java.util.List;

@Service
public class CustomerReportServiceImpl implements CustomerReportService {

    @Autowired
    private  CustomerSalesReportRepository repository;

    @Override
    public List<CustomerWiseSalesReportDTO> getCustomerWiseSales(Shop shop, LocalDate fromDate, LocalDate toDate) {
        return repository.getCustomerWiseSales(shop, fromDate, toDate);
    }
}
