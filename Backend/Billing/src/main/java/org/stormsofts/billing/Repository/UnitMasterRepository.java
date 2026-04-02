package org.stormsofts.billing.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.billing.model.UnitMaster;

@Repository
public interface UnitMasterRepository extends JpaRepository<UnitMaster,Long> {
}
