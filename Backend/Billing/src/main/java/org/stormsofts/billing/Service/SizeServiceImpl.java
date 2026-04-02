package org.stormsofts.billing.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.billing.Repository.SizeRepository;
import org.stormsofts.billing.model.SizeMaster;

import java.util.List;

@Service
public class SizeServiceImpl implements SizeService{

    @Autowired
    private SizeRepository sizeRepository;

    public List<SizeMaster> getAllSizes() {
        return sizeRepository.findAll();
    }

    public List<SizeMaster> getSizesByUnit(Long unitId) {
        return sizeRepository.findByUnit_UnitId(unitId);
    }
}
