package org.stormsofts.billing.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.stormsofts.billing.model.Employee;
import org.stormsofts.billing.model.Shop;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("""
       SELECT e FROM Employee e 
       WHERE e.shop = :shop AND 
       (LOWER(e.name) LIKE LOWER(CONCAT('%', :key, '%'))
        OR LOWER(e.role) LIKE LOWER(CONCAT('%', :key, '%'))
        OR LOWER(e.mob) LIKE LOWER(CONCAT('%', :key, '%')))
    """)
    List<Employee> searchByShop(Shop shop, String key);

    List<Employee> findByShop(Shop shop);
}
