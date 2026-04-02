package org.stormsofts.billing.Service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.billing.Exception.InsufficientStockException;
import org.stormsofts.billing.Repository.StockRepository;
import org.stormsofts.billing.Repository.ShopRepository;
import org.stormsofts.billing.model.*;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StockServiceImpl implements StockService {

    @Autowired
    private  StockRepository stockRepository;
    @Autowired
    private  ShopRepository shopRepository;

    @Autowired
    private  HttpServletRequest request;   // ✅ inject request

    // ✅ REPLACED METHOD
    private Shop getCurrentShop() {
        Long shopId = (Long) request.getAttribute("shopId");

        if (shopId == null) {
            throw new RuntimeException("Shop not found in token");
        }

        return shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
    }

    @Override
    public List<Stock> getAllStocks() {
        System.out.println("findbyshop"+stockRepository.findByShop(getCurrentShop()));
        return stockRepository.findByShop(getCurrentShop());
    }

    @Override
    public Stock increaseStock(Product product, SizeMaster size, Double qty) {

        if (qty == null || qty <= 0) {
            throw new RuntimeException("Invalid quantity");
        }

        Shop shop = getCurrentShop();

        Stock stock = stockRepository
                .findByShopAndProductAndSize(shop, product, size)
                .orElseGet(() -> {
                    Stock s = new Stock();
                    s.setShop(shop);
                    s.setProduct(product);
                    s.setSize(size);
                    s.setQuantity(0.0);
                    return s;
                });

        stock.setQuantity(stock.getQuantity() + qty);
        return stockRepository.save(stock);
    }

    @Override
    public Stock decreaseStock(Product product, SizeMaster size, Double qty) {

        if (qty == null || qty <= 0) {
            throw new RuntimeException("Invalid quantity");
        }

        Shop shop = getCurrentShop();

        Stock stock = stockRepository
                .findByShopAndProductAndSize(shop, product, size)
                .orElseThrow(() ->
                        new RuntimeException("Stock not found for selected size")
                );

        if (stock.getQuantity() < qty) {
            throw new InsufficientStockException(
                    product.getpName() + " (" + size.getSizeDisplay() + ")",
                    stock.getQuantity()
            );
        }

        stock.setQuantity(stock.getQuantity() - qty);
        return stockRepository.save(stock);
    }
}
