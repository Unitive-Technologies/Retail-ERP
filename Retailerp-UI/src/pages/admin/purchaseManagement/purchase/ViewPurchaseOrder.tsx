import { PurchaseOrderData } from '@constants/DummyData';
import PurchaseCommonView from '@components/PurchaseCommonView';
import PageHeader from '@components/PageHeader';

const ViewPurchaseOrder = () => {
  const transformedSummary = {
    inWords: PurchaseOrderData.summary.inWords,
    subTotal: '₹21,000.00',
    sgstPercentage: '1.5 %',
    sgstAmount: '₹290.00',
    cgstPercentage: '1.5 %',
    cgstAmount: '₹290.00',
    discountPercentage: '2 %',
    discountAmount: '₹115.00',
    totalAmount: '₹21,465.00',
    totalReceivedWeight: '22.35 g',
    totalOrderedWeight: '22.35 g',
  };

  const transformedPurchaseItems = PurchaseOrderData.purchaseItems.map(
    (item) => ({
      ...item,
      id: item.id.toString(),
    })
  );

  return (
    <>
      <PageHeader
        title="View Purchase Order"
        titleStyle={{ borderBottom: '2px solid #471923', color: '#000' }}
        showDownloadBtn={true}
        showCreateBtn={false}
      />
      <PurchaseCommonView
        Subtitle="Purchase Order"
        dateLabel="Date"
        grnNoLabel="Purchase Order No"
        showRefNo={false}
        showRemarks={true}
        showAddress2={false}
        tableHeaders={{
          sno: 'S.No',
          materialType: 'Material Type',
          category: 'Category',
          subCategory: 'Sub Category',
          description: 'Product Name',
          purity: 'Purity',
          orderedWeight: 'Quantity',
          receivedWeight: 'Weight',
          rate: 'Rate',
          amount: 'Amount',
        }}
        showPaymentDetails={false}
        companyData={PurchaseOrderData.companyData}
        supplierData={PurchaseOrderData.supplierData}
        grnDetails={PurchaseOrderData.purchaseDetails}
        grnItems={transformedPurchaseItems}
        summary={transformedSummary}
        remarks={PurchaseOrderData.remarks}
      />
    </>
  );
};

export default ViewPurchaseOrder;
