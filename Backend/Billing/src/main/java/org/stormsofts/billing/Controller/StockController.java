package org.stormsofts.billing.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.billing.Repository.ProductRepository;
import org.stormsofts.billing.Repository.SizeRepository;
import org.stormsofts.billing.Service.StockService;
import org.stormsofts.billing.model.Product;
import org.stormsofts.billing.model.SizeMaster;
import org.stormsofts.billing.model.Stock;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")

@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class StockController {

    @Autowired
    private  StockService stockService;
    @Autowired
    private  ProductRepository productRepository;
    @Autowired
    private  SizeRepository sizeRepository;

    @GetMapping
    public List<Stock> getAllStocks() {
        System.out.println("inside controller");
        return stockService.getAllStocks();
    }

    @PostMapping("/increase")
    public Stock increaseStock(
            @RequestParam Long productId,
            @RequestParam Long sizeId,
            @RequestParam Double qty
    ) {
        Product product = productRepository.findById(productId).orElseThrow();
        SizeMaster size = sizeRepository.findById(sizeId).orElseThrow();

        return stockService.increaseStock(product, size, qty);
    }
}
