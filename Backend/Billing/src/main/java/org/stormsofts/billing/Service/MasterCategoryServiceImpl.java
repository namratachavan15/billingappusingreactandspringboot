package org.stormsofts.billing.Service;



import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.billing.Repository.MasterCategoryRepository;
import org.stormsofts.billing.Repository.ShopRepository;
import org.stormsofts.billing.model.MasterCategory;
import org.stormsofts.billing.model.Shop;


import java.util.List;

@Service
@RequiredArgsConstructor
public class MasterCategoryServiceImpl implements MasterCategoryService {

    @Autowired
    private  MasterCategoryRepository repo;
    @Autowired
    private  ShopRepository shopRepo;
    @Autowired
    private  HttpServletRequest request;

    /* ================= GET SHOP FROM TOKEN ================= */
    private Shop getCurrentShop() {
        Long shopId = (Long) request.getAttribute("shopId");

        if (shopId == null) {
            throw new RuntimeException("Shop not found in token");
        }

        return shopRepo.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
    }

    /* ================= FETCH ALL ================= */
    @Override
    public List<MasterCategory> getAllCategories() {
        return repo.findByShop_ShopId(
                getCurrentShop().getShopId()
        );
    }

    /* ================= SEARCH ================= */
    @Override
    public List<MasterCategory> searchCategories(String keyword) {
        Long shopId = getCurrentShop().getShopId();

        return repo
                .findByShop_ShopIdAndNameContainingIgnoreCaseOrShop_ShopIdAndDescriptionContainingIgnoreCase(
                        shopId, keyword,
                        shopId, keyword
                );
    }

    /* ================= GET BY ID ================= */
    @Override
    public MasterCategory getCategoryById(Long id) {
        return repo.findByMACIDAndShop_ShopId(
                id,
                getCurrentShop().getShopId()
        ).orElseThrow(() -> new RuntimeException("Category not found"));
    }

    /* ================= SAVE ================= */
    @Override
    public MasterCategory saveCategory(MasterCategory category) {
        category.setStatus(true);
        category.setShop(getCurrentShop());
        return repo.save(category);
    }

    /* ================= UPDATE ================= */
    @Override
    public MasterCategory updateCategory(Long id, MasterCategory category) {
        MasterCategory existing = getCategoryById(id);

        existing.setName(category.getName());
        existing.setDescription(category.getDescription());
        existing.setStatus(true);

        return repo.save(existing);
    }

    /* ================= DELETE ================= */
    @Override
    public void deleteCategory(Long id) {
        repo.deleteByMACIDAndShop_ShopId(
                id,
                getCurrentShop().getShopId()
        );
    }
}

