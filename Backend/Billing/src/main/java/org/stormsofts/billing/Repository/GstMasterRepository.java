package org.stormsofts.billing.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.billing.model.GstMaster;

@Repository
public interface GstMasterRepository extends JpaRepository<GstMaster,Long> {
}
