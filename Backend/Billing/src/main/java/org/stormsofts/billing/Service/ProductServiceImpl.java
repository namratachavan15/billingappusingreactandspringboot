package org.stormsofts.billing.Service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.billing.Repository.ProductRepository;
import org.stormsofts.billing.Repository.GstMasterRepository;
import org.stormsofts.billing.Repository.ShopRepository;
import org.stormsofts.billing.model.GstMaster;
import org.stormsofts.billing.model.Product;
import org.stormsofts.billing.model.Shop;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private GstMasterRepository gstRepo;

    @Autowired
    private ShopRepository shopRepo;

    @Autowired
    private  HttpServletRequest request;   // ✅ inject request

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
    public List<Product> getAll() {
        return productRepo.findByShop(getCurrentShop());
    }

    @Override
    public List<Product> search(String keyword) {
        return productRepo.searchByNameOrCategory(keyword, getCurrentShop());
    }

    @Override
    public Product save(Product p) {
        GstMaster gst = gstRepo.findById(p.getGst().getGstId())
                .orElseThrow(() -> new RuntimeException("GST not found"));

        double gstAmt = (p.getBasePrice() * gst.getGstRate()) / 100;
        p.setPriceWithGst(p.getBasePrice() + gstAmt);
        p.setGst(gst);

        // Assign shop automatically
        p.setShop(getCurrentShop());
        p.setStatus(true);

        return productRepo.save(p);
    }

    @Override
    public Product update(Long id, Product p) {
        p.setPId(id);

        GstMaster gst = gstRepo.findById(p.getGst().getGstId())
                .orElseThrow(() -> new RuntimeException("GST not found"));
        p.setGst(gst);

        double gstAmt = (p.getBasePrice() * gst.getGstRate()) / 100;
        p.setPriceWithGst(p.getBasePrice() + gstAmt);

        if (p.getShop() == null) p.setShop(getCurrentShop());
        p.setStatus(true);

        return productRepo.save(p);
    }

    @Override
    public void delete(Long id) {
        productRepo.deleteById(id);
    }
}
