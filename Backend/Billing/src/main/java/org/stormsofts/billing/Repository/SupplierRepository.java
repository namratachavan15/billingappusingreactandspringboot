package org.stormsofts.billing.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.stormsofts.billing.model.Supplier;
import org.stormsofts.billing.model.Shop;

import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findByShop(Shop shop);
    List<Supplier> findBySupNameContainingIgnoreCaseOrMobContainingAndShop(String name, String mob, Shop shop);
    @Query("SELECT COUNT(s) FROM Supplier s WHERE s.shop = :shop")
    long countByShop(@Param("shop") Shop shop);
}
