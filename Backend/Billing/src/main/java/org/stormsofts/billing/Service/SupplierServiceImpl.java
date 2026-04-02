package org.stormsofts.billing.Service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.billing.Repository.SupplierRepository;
import org.stormsofts.billing.Repository.ShopRepository;
import org.stormsofts.billing.model.Supplier;
import org.stormsofts.billing.model.Shop;

import java.util.List;

@Service
@RequiredArgsConstructor

public class SupplierServiceImpl implements SupplierService {

    @Autowired
    private SupplierRepository repo;

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
    public List<Supplier> getAll() {
        return repo.findByShop(getCurrentShop());
    }

    @Override
    public Supplier save(Supplier sup) {
        sup.setShop(getCurrentShop());
        return repo.save(sup);
    }

    @Override
    public Supplier update(Long id, Supplier sup) {
        Supplier existing = repo.findById(id).orElseThrow();
        existing.setSupName(sup.getSupName());
        existing.setMob(sup.getMob());
        existing.setGstNo(sup.getGstNo());
        existing.setAddress(sup.getAddress());
        existing.setShop(getCurrentShop());
        return repo.save(existing);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    public List<Supplier> search(String key) {
        return repo.findBySupNameContainingIgnoreCaseOrMobContainingAndShop(key, key, getCurrentShop());
    }
}
