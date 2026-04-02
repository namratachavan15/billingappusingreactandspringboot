package org.stormsofts.billing.Repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.stormsofts.billing.model.Customer;
import org.stormsofts.billing.model.Shop;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // 🔹 Fetch all customers of a specific shop
    List<Customer> findByShop(Shop shop);

    // 🔹 Search customers of a specific shop by name
    List<Customer> findByShopAndNameContainingIgnoreCase(Shop shop, String keyword);

    @Query("SELECT COUNT(c) FROM Customer c WHERE c.shop = :shop")
    long countByShop(@Param("shop") Shop shop);
}

