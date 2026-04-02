package org.stormsofts.billing.Service;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.billing.Repository.ProductRepository;
import org.stormsofts.billing.Repository.PurchaseItemRepository;
import org.stormsofts.billing.Repository.SaleRepository;
import org.stormsofts.billing.Repository.ShopRepository;
import org.stormsofts.billing.model.*;
import org.stormsofts.billing.utility.BillNumberGenerator;

import java.util.List;


@Service
@RequiredArgsConstructor
public class SaleServiceImpl implements SaleService{
    @Autowired
    private SaleRepository repo;

    @Autowired
    private StockService stockService;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private ShopRepository shopRepo;

    @Autowired
    private   HttpServletRequest request;   // ✅ inject request

    // ✅ REPLACED METHOD
    private Shop getCurrentShop() {
        Long shopId = (Long) request.getAttribute("shopId");

        if (shopId == null) {
            throw new RuntimeException("Shop not found in token");
        }

        return shopRepo.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
    }

    @Override
    public Sale getByBillNo(String billNo) {

        Sale sale = repo.findByBillNo(billNo)
                .orElseThrow(() ->
                        new RuntimeException("Sale not found for bill: " + billNo)
                );

        // 🔥 ONLY CHECK SHOP IF TOKEN EXISTS
        Long shopId = (Long) request.getAttribute("shopId");

        if (shopId != null && !sale.getShop().getShopId().equals(shopId)) {
            throw new RuntimeException("Unauthorized access");
        }

        return sale;
    }


    @Override
    public List<Sale> getAll() {
        return repo.findByShop(getCurrentShop());
    }

    @Override
    public Sale getById(Long id) {
        Sale sale = repo.findById(id).orElseThrow();
        if (!sale.getShop().getShopId().equals(getCurrentShop().getShopId())) {
            throw new RuntimeException("Unauthorized access");
        }
        return sale;
    }

//    public Sale save(Sale sale) {
//        calculateTotalAndLinkItems(sale);
//        return repo.save(sale);
//    }

    @Transactional
    @Override
    public Sale save(Sale sale) {

        Shop shop = getCurrentShop();
        sale.setShop(shop); // 🔑 VERY IMPORTANT

        double total = 0.0;

        for (SaleItem item : sale.getSaleItems()) {

            Product product = productRepo
                    .findById(item.getProduct().getPId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // 🔐 PRODUCT MUST BELONG TO SAME SHOP
            if (!product.getShop().getShopId().equals(shop.getShopId())) {
                throw new RuntimeException("Product does not belong to this shop");
            }

            item.setProduct(product);
            item.setSale(sale);

            if (item.getDiscountPercent() == null && product.getDiscount() != null) {
                item.setDiscountPercent(product.getDiscount().getDiscountValue());
            }

            item.calculateTaxes();
            total += item.getTotalAmount();

            // 🔥 SHOP-AWARE STOCK
            stockService.decreaseStock(product, item.getSize(), item.getQuantity());
        }

        sale.setTotalAmt(total);
        Sale savedSale=repo.save(sale);
        String billNo = BillNumberGenerator.generateBillNo(savedSale.getSaleId());

        // 3️⃣ Set & update
        savedSale.setBillNo(billNo);
        return repo.save(savedSale);
    }

//    @Transactional
//    public Sale save(Sale sale) {
//
//        double saleTotal = 0;
//
//        for (SaleItem saleItem : sale.getSaleItems()) {
//
//            double qtyToSell = saleItem.getQuantity();
//
//            List<PurchaseItem> stockList =
//                    purchaseItemRepo
//                            .findByProductAndRemainingQuantityGreaterThanOrderByPurchase_PurchaseDateAsc(
//                                    saleItem.getProduct(), 0.0
//                            );
//
//            for (PurchaseItem stock : stockList) {
//
//                if (qtyToSell <= 0) break;
//
//                if (stock.getRemainingQuantity() >= qtyToSell) {
//                    stock.setRemainingQuantity(
//                            stock.getRemainingQuantity() - qtyToSell
//                    );
//                    qtyToSell = 0;
//                } else {
//                    qtyToSell -= stock.getRemainingQuantity();
//                    stock.setRemainingQuantity(0.0);
//                }
//
//                purchaseItemRepo.save(stock);
//            }
//
//            // ❌ NOT ENOUGH STOCK
//            if (qtyToSell > 0) {
//                throw new RuntimeException(
//                        "Out of stock for product: " +
//                                saleItem.getProduct().getPName()
//                );
//            }
//
//            saleItem.calculateTotal();
//            saleItem.setSale(sale);
//            saleTotal += saleItem.getTotalAmount();
//        }
//
//        sale.setTotalAmt(saleTotal);
//        return repo.save(sale);
//    }
//



    @Override
    public Sale update(Long id, Sale sale) {
        Sale existing = getById(id);

        existing.setCustomer(sale.getCustomer());
        existing.setSaleDate(sale.getSaleDate());
        existing.getSaleItems().clear();

        if (sale.getSaleItems() != null) {
            for (SaleItem item : sale.getSaleItems()) {
                item.calculateTaxes();
                item.setSale(existing);
                existing.getSaleItems().add(item);
            }
        }

        calculateTotal(existing);
        return repo.save(existing);
    }

    @Override
    public void delete(Long id) {
        Sale sale = getById(id);
        repo.delete(sale);
    }


    @Override
    public List<Sale> search(String key) {
        return repo.findByShop(getCurrentShop()).stream()
                .filter(s ->
                        (s.getCustomer() != null &&
                                s.getCustomer().getName().toLowerCase().contains(key.toLowerCase()))
                                || s.getSaleDate().toString().contains(key)
                )
                .toList();
    }

    private void calculateTotalAndLinkItems(Sale sale) {
        if(sale.getSaleItems() != null) {
            double total = 0;
            for(SaleItem item : sale.getSaleItems()) {
                System.out.println("inside saleitem");
                item.calculateTaxes();
                System.out.println("outside saleitem");
                item.setSale(sale);
                total += item.getTotalAmount();
            }
            sale.setTotalAmt(total);
        }
    }

    private void calculateTotal(Sale sale) {
        double total = 0;
        if (sale.getSaleItems() != null) {
            for (SaleItem item : sale.getSaleItems()) {
                total += item.getTotalAmount();
            }
        }
        sale.setTotalAmt(total);
    }
}
