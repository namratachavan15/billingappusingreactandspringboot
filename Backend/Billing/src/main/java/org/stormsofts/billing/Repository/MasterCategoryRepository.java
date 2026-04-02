package org.stormsofts.billing.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.stormsofts.billing.model.MasterCategory;

import java.util.List;
import java.util.Optional;

public interface MasterCategoryRepository
        extends JpaRepository<MasterCategory, Long> {

    // ✅ LIST
    List<MasterCategory> findByShop_ShopId(Long shopId);

    // ✅ GET BY ID
    Optional<MasterCategory> findByMACIDAndShop_ShopId(Long id, Long shopId);

    // ✅ SEARCH
    List<MasterCategory>
    findByShop_ShopIdAndNameContainingIgnoreCaseOrShop_ShopIdAndDescriptionContainingIgnoreCase(
            Long shopId1, String name,
            Long shopId2, String description
    );

    // ✅ DELETE
    void deleteByMACIDAndShop_ShopId(Long id, Long shopId);
}
