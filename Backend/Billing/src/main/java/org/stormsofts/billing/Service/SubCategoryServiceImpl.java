package org.stormsofts.billing.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.billing.Repository.MainCategoryRepository;
import org.stormsofts.billing.Repository.ShopRepository;
import org.stormsofts.billing.Repository.SubCategoryRepository;
import org.stormsofts.billing.model.MainCategory;
import org.stormsofts.billing.model.Shop;
import org.stormsofts.billing.model.SubCategory;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubCategoryServiceImpl implements SubCategoryService {

    @Autowired
    private  SubCategoryRepository repo;
    @Autowired
    private  MainCategoryRepository mainRepo;
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

    /* ================= GET ALL ================= */
    @Override
    public List<SubCategory> getAllSubCategories() {
        return repo.findByMainCategory_MasterCategory_Shop_ShopId(
                getCurrentShop().getShopId()
        );
    }

    /* ================= SEARCH ================= */
    @Override
    public List<SubCategory> searchSubCategories(String keyword) {
        return repo.findByNameContainingIgnoreCaseAndMainCategory_MasterCategory_Shop_ShopId(
                keyword,
                getCurrentShop().getShopId()
        );
    }

    /* ================= GET BY ID ================= */
    @Override
    public SubCategory getSubCategoryById(Long id) {
        return repo.findBySCIdAndMainCategory_MasterCategory_Shop_ShopId(
                id,
                getCurrentShop().getShopId()
        ).orElseThrow(() -> new RuntimeException("SubCategory not found"));
    }
    /* ================= SAVE ================= */
    @Override
    public SubCategory saveSubCategory(SubCategory subCategory) {

        Long shopId = getCurrentShop().getShopId();

        // 🔐 Validate MainCategory belongs to this shop
        MainCategory mainCategory = mainRepo
                .findByMCIDAndMasterCategory_Shop_ShopId(
                        subCategory.getMainCategory().getMCID(),
                        shopId
                )
                .orElseThrow(() -> new RuntimeException("Invalid Main Category"));

        subCategory.setMainCategory(mainCategory);
        subCategory.setStatus(true);

        return repo.save(subCategory);
    }

    /* ================= UPDATE ================= */
    @Override
    public SubCategory updateSubCategory(Long id, SubCategory subCategory) {

        SubCategory existing = getSubCategoryById(id);
        Long shopId = getCurrentShop().getShopId();

        MainCategory mainCategory = mainRepo
                .findByMCIDAndMasterCategory_Shop_ShopId(
                        subCategory.getMainCategory().getMCID(),
                        shopId
                )
                .orElseThrow(() -> new RuntimeException("Invalid Main Category"));

        existing.setName(subCategory.getName());
        existing.setMainCategory(mainCategory);
        existing.setStatus(true);

        return repo.save(existing);
    }

    /* ================= DELETE ================= */
    @Override
    @Transactional
    public void deleteSubCategory(Long id) {
        repo.deleteBySCIdAndMainCategory_MasterCategory_Shop_ShopId(
                id,
                getCurrentShop().getShopId()
        );
    }
}
