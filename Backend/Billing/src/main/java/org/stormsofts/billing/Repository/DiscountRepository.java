package org.stormsofts.billing.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.billing.model.DiscountMaster;

@Repository
public interface DiscountRepository extends JpaRepository<DiscountMaster,Long> {
}
