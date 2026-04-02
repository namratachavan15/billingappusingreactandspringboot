package org.stormsofts.billing.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.billing.model.MainCategory;

import java.util.List;
import java.util.Optional;

@Repository
public interface MainCategoryRepository extends JpaRepository<MainCategory, Long> {

    // Get all main categories of current shop
    List<MainCategory> findByMasterCategory_Shop_ShopId(Long shopId);

    // Search by name within shop
    List<MainCategory> findByMasterCategory_Shop_ShopIdAndNameContainingIgnoreCase(
            Long shopId,
            String keyword
    );

    // Find by ID + shop (SECURITY)
    Optional<MainCategory> findByMCIDAndMasterCategory_Shop_ShopId(
            Long mcid,
            Long shopId
    );

    // Delete by ID + shop
    void deleteByMCIDAndMasterCategory_Shop_ShopId(
            Long mcid,
            Long shopId
    );
}

