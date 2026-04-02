package org.stormsofts.billing.Repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.billing.model.SubCategory;
import java.util.List;
import java.util.Optional;

@Repository

public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {

    List<SubCategory> findByMainCategory_MasterCategory_Shop_ShopId(Long shopId);

    List<SubCategory> findByNameContainingIgnoreCaseAndMainCategory_MasterCategory_Shop_ShopId(
            String keyword,
            Long shopId
    );

    Optional<SubCategory> findBySCIdAndMainCategory_MasterCategory_Shop_ShopId( // <- SCId
                                                                                Long scid,
                                                                                Long shopId
    );

    void deleteBySCIdAndMainCategory_MasterCategory_Shop_ShopId( // <- SCId
                                                                 Long scid,
                                                                 Long shopId
    );
}
