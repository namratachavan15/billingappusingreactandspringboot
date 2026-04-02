package org.stormsofts.billing.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long PId;

    @Column(nullable = false)
    @JsonProperty("pName")
    private String pName;

    // Category hierarchy
    @ManyToOne
    @JoinColumn(name = "master_category_id")
    private MasterCategory masterCategory;

    @ManyToOne
    @JoinColumn(name = "main_category_id")
    private MainCategory mainCategory;

    @ManyToOne
    @JoinColumn(name = "sub_category_id")
    private SubCategory subCategory;

    // Pricing
    private Double basePrice;      // price without GST
    private Double priceWithGst;   // calculated/stored

    @ManyToOne(optional = false)   // 🔒 GST MUST EXIST
    @JoinColumn(name = "gst_id", nullable = false)
    private GstMaster gst;


    // Unit
    @ManyToOne
    @JoinColumn(name = "unit_id")
    private UnitMaster unit;

    // Other details
    private String description;
    private String image;
    private String rackNumber;

    @ManyToOne
    @JoinColumn(name = "discount_id")
    private DiscountMaster discount; // optional


    @ManyToOne(optional = false)
    @JoinColumn(name = "shop_id", nullable = false)
    @JsonIgnore
    private Shop shop;

    private Boolean status;

    public Long getPId() {
        return PId;
    }

    public void setPId(Long PId) {
        this.PId = PId;
    }

    public String getpName() {
        return pName;
    }

    public void setpName(String pName) {
        this.pName = pName;
    }

    public MasterCategory getMasterCategory() {
        return masterCategory;
    }

    public void setMasterCategory(MasterCategory masterCategory) {
        this.masterCategory = masterCategory;
    }

    public MainCategory getMainCategory() {
        return mainCategory;
    }

    public void setMainCategory(MainCategory mainCategory) {
        this.mainCategory = mainCategory;
    }

    public SubCategory getSubCategory() {
        return subCategory;
    }

    public void setSubCategory(SubCategory subCategory) {
        this.subCategory = subCategory;
    }

    public Double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(Double basePrice) {
        this.basePrice = basePrice;
    }

    public Double getPriceWithGst() {
        return priceWithGst;
    }

    public void setPriceWithGst(Double priceWithGst) {
        this.priceWithGst = priceWithGst;
    }

    public GstMaster getGst() {
        return gst;
    }

    public void setGst(GstMaster gst) {
        this.gst = gst;
    }

    public UnitMaster getUnit() {
        return unit;
    }

    public void setUnit(UnitMaster unit) {
        this.unit = unit;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getRackNumber() {
        return rackNumber;
    }

    public void setRackNumber(String rackNumber) {
        this.rackNumber = rackNumber;
    }

    public DiscountMaster getDiscount() {
        return discount;
    }

    public void setDiscount(DiscountMaster discount) {
        this.discount = discount;
    }

    public Shop getShop() {
        return shop;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}
