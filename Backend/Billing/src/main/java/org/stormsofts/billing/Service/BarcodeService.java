package org.stormsofts.billing.Service;

import com.google.zxing.*;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class BarcodeService {

    public byte[] generateBarcodeImage(String billNo) {
        try {
            BitMatrix bitMatrix = new MultiFormatWriter()
                    .encode(billNo, BarcodeFormat.CODE_128, 300, 80);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Barcode generation failed", e);
        }
    }
}
