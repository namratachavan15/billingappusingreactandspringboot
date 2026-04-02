import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ShopProvider } from './assets/Components/States/ShopContext'
import { MasterCategoryProvider } from './assets/Components/States/MasterCategoryContext'
import { MainCategoryProvider } from './assets/Components/States/MainCategoryContext'
import { SubCategoryProvider } from './assets/Components/States/SubCategoryContext'

import { CustomerProvider } from './assets/Components/States/CustomerContext'
import { EmployeeProvider } from './assets/Components/States/EmployeeContext'
import { SupplierProvider } from './assets/Components/States/SupplierContext'
import { PurchaseProvider } from './assets/Components/States/PurchaseContext'
import { UnitMasterProvider } from './assets/Components/States/UnitMasterContext'
import { GstMasterProvider } from './assets/Components/States/GstMasterContext'
import { ProductProvider } from './assets/Components/States/ProductContext'
import { SaleProvider } from './assets/Components/States/SaleContext'
import { StockProvider } from './assets/Components/States/StockContext'
import { SizeProvider } from './assets/Components/States/SizeContext'
import { DiscountProvider } from './assets/Components/States/DiscountContext'
import { PurchaseReportProvider } from './assets/Components/States/PurchaseReportContext'
import { AuthProvider } from './assets/Components/States/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> 
  <SubCategoryProvider>
    <MainCategoryProvider>
      <ShopProvider>
        <MasterCategoryProvider>
          <CustomerProvider>
            <EmployeeProvider>
              <SupplierProvider>
                <PurchaseProvider>
                  <UnitMasterProvider>
                    <GstMasterProvider>
                      <ProductProvider>
                        <StockProvider> {/* Moved before SaleProvider */}
                          <SaleProvider>
                            <SizeProvider>
                              <DiscountProvider>
                                <PurchaseReportProvider>
                                <App />

                                </PurchaseReportProvider>
                             
                              </DiscountProvider>
                           
                            </SizeProvider>
                                                      </SaleProvider>
                        </StockProvider>
                      </ProductProvider>
                    </GstMasterProvider>
                  </UnitMasterProvider>
                </PurchaseProvider>
              </SupplierProvider>
            </EmployeeProvider>
          </CustomerProvider>
        </MasterCategoryProvider>
      </ShopProvider>
    </MainCategoryProvider>
  </SubCategoryProvider>
  </AuthProvider>
</StrictMode>
,
)
