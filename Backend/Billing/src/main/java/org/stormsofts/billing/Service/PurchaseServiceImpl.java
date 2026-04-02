package org.stormsofts.billing.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.billing.Repository.PurchaseRepository;
import org.stormsofts.billing.Repository.ShopRepository;
import org.stormsofts.billing.Repository.StockRepository;
import org.stormsofts.billing.model.Purchase;
import org.stormsofts.billing.model.PurchaseItem;
import org.stormsofts.billing.model.Shop;
import org.stormsofts.billing.model.Stock;

import java.util.List;

@Service
//@RequiredArgsConstructor
public class PurchaseServiceImpl implements PurchaseService {

    @Autowired
    private PurchaseRepository repo;

    @Autowired
    private ShopRepository shopRepo;

    @Autowired
    private StockRepository stockRepository;

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

//    @Override
//    public Purchase save(Purchase pur) {
//        // calculate total from purchase items
//        if (pur.getPurchaseItems() != null) {
//            double total = 0;
//            for (PurchaseItem item : pur.getPurchaseItems()) {
//                item.setTotalAmount(item.getPurchasePrice() * item.getQuantity() + (item.getPurchasePrice() * item.getQuantity() * item.getGstRate() / 100));
//                item.setPurchase(pur); // link item to purchase
//                total += item.getTotalAmount();
//            }
//            pur.setTotalAmt(total);
//        }
//        return repo.save(pur);
//    }


//@Override
//public Purchase save(Purchase pur) {
//
//    if (pur.getPurchaseItems() != null) {
//        double total = 0;
//
//        for (PurchaseItem item : pur.getPurchaseItems()) {
//
//            item.setRemainingQuantity(item.getQuantity()); // ✅ ADD THIS
//
//            item.setTotalAmount(
//                    item.getPurchasePrice() * item.getQuantity()
//                            + (item.getPurchasePrice() * item.getQuantity() * item.getGstRate() / 100)
//            );
//
//            item.setPurchase(pur);
//            total += item.getTotalAmount();
//        }
//        pur.setTotalAmt(total);
//    }
//    return repo.save(pur);
//}

//    @Transactional
//    public Purchase save(Purchase purchase) {
//
//        double total = 0.0;
//
//        for (PurchaseItem item : purchase.getPurchaseItems()) {
//            item.setPurchase(purchase); // 🔥 IMPORTANT
//            if (item.getBatchNo() == null || item.getBatchNo().isEmpty()) {
//                item.setBatchNo(item.getProduct().getPId() + "-" + System.currentTimeMillis());
//            }
//
//            if (item.getTotalAmount() == null) {
//                item.setTotalAmount(item.getPurchasePrice() * item.getQuantity() + (item.getPurchasePrice() * item.getQuantity() * item.getGstRate() / 100));
//            }
//            total += item.getTotalAmount();
//        }
//
//        purchase.setTotalAmt(total); // 🔥 IMPORTANT
//
//        Purchase savedPurchase = repo.save(purchase);
//
//        for (PurchaseItem item : savedPurchase.getPurchaseItems()) {
//            Stock stock = stockRepository.findByProduct_PId(
//                    item.getProduct().getPId()
//            );
//
//            if (stock == null) {
//                stock = new Stock();
//                stock.setProduct(item.getProduct());
//                stock.setQuantity(item.getQuantity());
//            } else {
//                stock.setQuantity(stock.getQuantity() + item.getQuantity());
//            }
//
//            stockRepository.save(stock);
//        }
//
//        return savedPurchase;
//    }

    @Override
    public List<Purchase> getAll() {
        return repo.findByShop(getCurrentShop());
    }

    @Override
    @Transactional
    public Purchase save(Purchase purchase) {

        purchase.setShop(getCurrentShop()); // ✅ CRITICAL

        double total = 0.0;

        for (PurchaseItem item : purchase.getPurchaseItems()) {
            item.setPurchase(purchase);

            if (item.getBatchNo() == null || item.getBatchNo().isEmpty()) {
                item.setBatchNo(item.getProduct().getPId() + "-" + System.currentTimeMillis());
            }

            item.setTotalAmount(
                    item.getPurchasePrice() * item.getQuantity()
                            + (item.getPurchasePrice() * item.getQuantity() * item.getGstRate() / 100)
            );

            total += item.getTotalAmount();
        }

        purchase.setTotalAmt(total);

        Purchase saved = repo.save(purchase);

        // ✅ SIZE-WISE STOCK UPDATE (SHOP SAFE)
        for (PurchaseItem item : saved.getPurchaseItems()) {

            Stock stock = stockRepository
                    .findByShopAndProductAndSize(
                            getCurrentShop(),
                            item.getProduct(),
                            item.getSize()
                    )
                    .orElseGet(() -> {
                        Stock s = new Stock();
                        s.setShop(getCurrentShop());
                        s.setProduct(item.getProduct());
                        s.setSize(item.getSize());
                        s.setQuantity(0.0);
                        return s;
                    });

            stock.setQuantity(stock.getQuantity() + item.getQuantity());
            stockRepository.save(stock);
        }

        return saved;
    }

    @Override
    public Purchase update(Long id, Purchase purchase) {

        Purchase existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase not found"));

        existing.setSupplier(purchase.getSupplier());
        existing.setPurchaseDate(purchase.getPurchaseDate());

        existing.getPurchaseItems().clear();

        double total = 0.0;
        for (PurchaseItem item : purchase.getPurchaseItems()) {
            item.setPurchase(existing);
            item.setTotalAmount(
                    item.getPurchasePrice() * item.getQuantity()
                            + (item.getPurchasePrice() * item.getQuantity() * item.getGstRate() / 100)
            );
            total += item.getTotalAmount();
            existing.getPurchaseItems().add(item);
        }

        existing.setTotalAmt(total);
        return repo.save(existing);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    public List<Purchase> search(String key) {
        return repo.search(getCurrentShop(), key);
    }


}
