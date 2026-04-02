package org.stormsofts.billing.Service;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.billing.Repository.MainCategoryRepository;
import org.stormsofts.billing.Repository.MasterCategoryRepository;
import org.stormsofts.billing.Repository.ShopRepository;
import org.stormsofts.billing.model.MainCategory;
import org.stormsofts.billing.model.MasterCategory;
import org.stormsofts.billing.model.Shop;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MainCategoryServiceImpl implements MainCategoryService {

    @Autowired
    private  MainCategoryRepository repo;
    @Autowired
    private  ShopRepository shopRepo;
    @Autowired
    private  MasterCategoryRepository masterRepo;
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

    /* ================= GET ALL ================= */
    @Override
    public List<MainCategory> getAllMainCategories() {
        return repo.findByMasterCategory_Shop_ShopId(
                getCurrentShop().getShopId()
        );
    }

    /* ================= SEARCH ================= */
    @Override
    public List<MainCategory> searchMainCategories(String keyword) {
        return repo.findByMasterCategory_Shop_ShopIdAndNameContainingIgnoreCase(
                getCurrentShop().getShopId(),
                keyword
        );
    }

    /* ================= GET BY ID ================= */
    @Override
    public MainCategory getMainCategoryById(Long id) {
        return repo.findByMCIDAndMasterCategory_Shop_ShopId(
                id,
                getCurrentShop().getShopId()
        ).orElseThrow(() -> new RuntimeException("Main Category not found"));
    }

    /* ================= SAVE ================= */
    @Override
    public MainCategory saveMainCategory(MainCategory category) {

        Long shopId = getCurrentShop().getShopId();

        // 🔐 Validate MasterCategory belongs to this shop
        MasterCategory mc = masterRepo
                .findByMACIDAndShop_ShopId(
                        category.getMasterCategory().getMACID(),
                        shopId
                )
                .orElseThrow(() -> new RuntimeException("Invalid Master Category"));

        category.setMasterCategory(mc);
        category.setStatus(true);

        return repo.save(category);
    }

    /* ================= UPDATE ================= */
    @Override
    public MainCategory updateMainCategory(Long id, MainCategory category) {

        MainCategory existing = getMainCategoryById(id);
        Long shopId = getCurrentShop().getShopId();

        MasterCategory mc = masterRepo
                .findByMACIDAndShop_ShopId(
                        category.getMasterCategory().getMACID(),
                        shopId
                )
                .orElseThrow(() -> new RuntimeException("Invalid Master Category"));

        existing.setName(category.getName());
        existing.setMasterCategory(mc);
        existing.setStatus(true);

        return repo.save(existing);
    }

    /* ================= DELETE ================= */
    @Override
    @Transactional
    public void deleteMainCategory(Long id) {
        repo.deleteByMCIDAndMasterCategory_Shop_ShopId(
                id,
                getCurrentShop().getShopId()
        );
    }
}
