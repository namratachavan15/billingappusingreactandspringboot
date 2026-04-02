package org.stormsofts.billing.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.stormsofts.billing.model.Product;
import org.stormsofts.billing.model.PurchaseItem;

import java.util.List;

@Repository
public interface PurchaseItemRepository extends JpaRepository<PurchaseItem, Long> {

//    List<PurchaseItem>
//    findByProductAndRemainingQuantityGreaterThanOrderByPurchase_PurchaseDateAsc(
//            Product product, Double qty
//    );
//    @Query("SELECT COALESCE(SUM(p.remainingQuantity),0) FROM PurchaseItem p WHERE p.product.PId = :pid")
//    Double sumRemainingQuantityByProductId(@Param("pid") Long pid);

}
