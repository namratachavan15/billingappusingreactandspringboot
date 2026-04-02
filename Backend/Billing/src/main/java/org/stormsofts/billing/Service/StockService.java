package org.stormsofts.billing.Service;

import org.stormsofts.billing.model.Product;
import org.stormsofts.billing.model.SizeMaster;
import org.stormsofts.billing.model.Stock;

import java.util.List;

public interface StockService {
    public List<Stock> getAllStocks();
    public Stock increaseStock(Product product, SizeMaster size, Double qty);
    public Stock decreaseStock(Product product, SizeMaster size, Double qty);
}
