package org.stormsofts.billing.Service;

import org.stormsofts.billing.model.SizeMaster;

import java.util.List;

public interface SizeService {

    public List<SizeMaster> getAllSizes();
    public List<SizeMaster> getSizesByUnit(Long unitId);
}
