package org.stormsofts.billing.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.billing.model.SizeMaster;

import java.util.List;

@Repository
public interface SizeRepository extends JpaRepository<SizeMaster, Long> {
    List<SizeMaster> findByUnit_UnitId(Long unitId);
}
