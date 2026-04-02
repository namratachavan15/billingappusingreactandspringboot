import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../Config/api";


const PrintBill = () => {
  const { saleId, billNo } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const url = billNo
      ? `/api/bill/scan/${billNo}`
      : `/api/bill/${saleId}`;

    api.get(url).then(res => {
      setData(res.data);
      setTimeout(() => window.print(), 300);
    });
  }, [saleId, billNo]);

  if (!data) return null;

  const { shop, sale } = data;

  // ================= CALCULATIONS =================
  const saleItemsWithCalc = sale.saleItems.map((i) => {
    const discountPercent = i.discountValue || i.discountPercent || 0;
    const discountedPrice = i.unitPriceWithGst - (i.unitPriceWithGst * discountPercent / 100);
    const totalAmount = discountedPrice * i.quantity;
    const gstRate = i.product.gst?.gstRate || 0;
    const halfGst = gstRate / 2;
    const taxableUnitPrice = discountedPrice / (1 + gstRate / 100);
    const taxableAmount = taxableUnitPrice * i.quantity;
    const cgstAmount = taxableAmount * (halfGst / 100);
    const sgstAmount = taxableAmount * (halfGst / 100);
    const savedAmountPerItem = (i.unitPriceWithGst - discountedPrice) * i.quantity;

    return {
      ...i,
      discountedPrice,
      totalAmount,
      cgstAmount,
      sgstAmount,
      taxableAmount,
      savedAmountPerItem,
      discountPercent,
    };
  });

  const totalQty = saleItemsWithCalc.reduce((sum, i) => sum + Number(i.quantity), 0);
  const totalTaxable = saleItemsWithCalc.reduce((sum, i) => sum + i.taxableAmount, 0);
  const totalCGST = saleItemsWithCalc.reduce((sum, i) => sum + i.cgstAmount, 0);
  const totalSGST = saleItemsWithCalc.reduce((sum, i) => sum + i.sgstAmount, 0);
  const totalAmt = saleItemsWithCalc.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalMrp = saleItemsWithCalc.reduce((sum, i) => sum + i.unitPriceWithGst * i.quantity, 0);
  const totalSaved = saleItemsWithCalc.reduce((sum, i) => sum + i.savedAmountPerItem, 0);

  const hrStyle = { border: "0.5px dashed #000", margin: "2px 0" };

  return (
    <div
      style={{
        width: "80mm",
        margin: "0 auto",
        fontFamily: "monospace",
        fontSize: "10px",
        color: "#000",
        border: "1px solid #000",
        padding: "4px",
        borderRadius: "2px",
        boxSizing: "border-box",
        marginTop:"50px"
      }}
    >
      {/* SHOP HEADER */}
      <div style={{ textAlign: "center", marginBottom: "2px" }}>
        <div style={{ fontWeight: "bold" }}>{shop.shopName}</div>
        <div>{shop.address}</div>
        <div>Mob: {shop.mobile}</div>
        {shop.gstNo && <div>GSTIN: {shop.gstNo}</div>}
      </div>
      <hr style={hrStyle} />

      {/* TAX INVOICE TITLE */}
      <div style={{ textAlign: "center", fontWeight: "bold", margin: "2px 0" }}>TAX INVOICE</div>
      <hr style={hrStyle} />

      {/* BILL INFO */}
      <div style={{ marginBottom: "2px", fontSize: "9px" }}>
      Bill No : {sale.billNo}
<br />
        Date : {new Date(sale.saleDate).toLocaleString()} <br />
        Customer : {sale.customer?.name || "Walk-in"}
      </div>
      <hr style={hrStyle} />

      {/* ITEM HEADER */}
      <div style={{ fontWeight: "bold", display: "flex", fontSize: "9px" }}>
        <div style={{ flex: 2 }}>Item</div>
        <div style={{ flex: 1, textAlign: "center" }}>Qty</div>
        <div style={{ flex: 1, textAlign: "center" }}>MRP</div>
        <div style={{ flex: 1, textAlign: "center" }}>Disc%</div>
        <div style={{ flex: 1, textAlign: "center" }}>CGST%</div>
        <div style={{ flex: 1, textAlign: "center" }}>SGST%</div>
        <div style={{ flex: 1, textAlign: "right" }}>Amt</div>
      </div>
      <hr style={hrStyle} />

      {/* ITEMS LOOP */}
      {saleItemsWithCalc.map((i, idx) => (
        <div key={idx} style={{ marginBottom: "2px", fontSize: "9px" }}>
          <div style={{ fontWeight: "bold" }}>
            {i.product.pName} {i.size && `(${i.size.sizeDisplay})`}
          </div>
          <div style={{ fontSize: "9px" }}>
            HSN: {i.product.PId} &nbsp; UOM: {i.product.unit?.unitName || "PC"}
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 2 }}>{i.size?.sizeDisplay || ""}</div>
            <div style={{ flex: 1, textAlign: "center" }}>{i.quantity}</div>
            <div style={{ flex: 1, textAlign: "center" }}>{i.unitPriceWithGst.toFixed(2)}</div>
            <div style={{ flex: 1, textAlign: "center" }}>{i.discountPercent.toFixed(0)}%</div>
            <div style={{ flex: 1, textAlign: "center" }}>{(i.product.gst?.gstRate / 2 || 0).toFixed(0)}%</div>
            <div style={{ flex: 1, textAlign: "center" }}>{(i.product.gst?.gstRate / 2 || 0).toFixed(0)}%</div>
            <div style={{ flex: 1, textAlign: "right" }}>{i.totalAmount.toFixed(2)}</div>
          </div>
        </div>
      ))}
      <hr style={hrStyle} />

      {/* TOTAL */}
      <div style={{ display: "flex", fontWeight: "bold", fontSize: "10px" }}>
        <div style={{ flex: 2 }}>Items: {sale.saleItems.length}</div>
        <div style={{ flex: 1 }}>Qty: {totalQty}</div>
        <div style={{ flex: 2, textAlign: "right" }}>TOTAL ₹ {totalAmt.toFixed(2)}</div>
      </div>
      <hr style={hrStyle} />

      {/* GST SUMMARY */}
      <div style={{ fontWeight: "bold", fontSize: "9px", textAlign: "center" }}>GST Summary</div>
      <div style={{ display: "flex", fontWeight: "bold", fontSize: "9px" }}>
        <div style={{ flex: 1 }}>Taxable</div>
        <div style={{ flex: 1, textAlign: "right"}}>CGST</div>
        <div style={{ flex: 1, textAlign: "right"}}>SGST</div>
        <div style={{ flex: 1, textAlign: "right"}}>GST</div>
      </div>
      <div style={{ display: "flex", fontSize: "9px" }}>
        <div style={{ flex: 1 }}>{totalTaxable.toFixed(2)}</div>
        <div style={{ flex: 1, textAlign: "right"}}>{totalCGST.toFixed(2)}</div>
        <div style={{ flex: 1, textAlign: "right"}}>{totalSGST.toFixed(2)}</div>
        <div style={{ flex: 1, textAlign: "right"}}>{(totalCGST + totalSGST).toFixed(2)}</div>
      </div>
      <hr style={hrStyle} />

      {/* SAVINGS */}
      <div style={{ display: "flex", fontWeight: "bold", fontSize: "9px" }}>
        <div style={{ flex: 2 }}>MRP Total</div>
        <div style={{ flex: 2, textAlign: "right"}}>₹ {totalMrp.toFixed(2)}</div>
      </div>
      <div style={{ display: "flex", fontWeight: "bold", fontSize: "9px", color: "green" }}>
        <div style={{ flex: 2 }}>You Saved</div>
        <div style={{ flex: 2, textAlign: "right"}}>₹ {totalSaved.toFixed(2)}</div>
      </div>
      <hr style={hrStyle} />

 

      {/* BANK DETAILS */}
      <div style={{ fontSize: "9px" }}>
        Bank: {shop.bankName} <br />
        A/C: {shop.bankAc} <br />
        IFSC: {shop.ifsc} <br />
        Branch: {shop.branchName}
      </div>
      <hr style={hrStyle} />

      {/* PAYMENT */}
      <div style={{ fontSize: "9px" }}>
        Payment Mode : Cash <br />
        Amount Paid : ₹ {totalAmt.toFixed(2)} <br />
        Balance : ₹ 0.00
      </div>
      <hr style={hrStyle} />
      {sale.billNo && (
  <div style={{ textAlign: "center", margin: "4px 0" }}>
  <img
  src={`http://localhost:5454/api/barcode/${sale.billNo}?token=${localStorage.getItem("token")}`}
  alt="Bill Barcode"
  style={{ width: "100%", height: "50px" }}
/>

    <div style={{ fontSize: "9px" }}>{sale.billNo}</div>
  </div>
)}

      {/* FOOTER */}
      <div style={{ textAlign: "center", fontSize: "9px" }}>
        ** Saved ₹ {totalSaved.toFixed(2)} on this bill ** <br />
        This is a computer generated invoice <br />
        THANK YOU 😊 <br />
        VISIT AGAIN
      </div>

      {/* PRINT STYLES */}
      <style>{`
        @media print {
          body { margin: 0; }
          @page { size: 80mm auto; margin: 2mm; }
          div { box-sizing: border-box; }
        }
      `}</style>
    </div>
  );
};

export default PrintBill;
