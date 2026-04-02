package org.stormsofts.billing.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gst_master")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GstMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gstId;

    @Column(nullable = false)
    private Double gstRate;   // 0, 5, 12, 18, 28

    private Boolean status;

    public Long getGstId() {
        return gstId;
    }

    public void setGstId(Long gstId) {
        this.gstId = gstId;
    }

    public Double getGstRate() {
        return gstRate;
    }

    public void setGstRate(Double gstRate) {
        this.gstRate = gstRate;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}
