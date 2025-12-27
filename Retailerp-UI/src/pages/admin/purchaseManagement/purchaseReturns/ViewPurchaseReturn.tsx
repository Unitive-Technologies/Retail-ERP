import { PurchaseReturnsData } from '@constants/DummyData';
import PurchaseCommonView from '@components/PurchaseCommonView';
import PageHeader from '@components/PageHeader';

const ViewPurchaseReturn = () => {
  const transformedSummary = {
    inWords: PurchaseReturnsData.summary.inWords,
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

  const transformedGrnItems = PurchaseReturnsData.grnItems.map((item) => ({
    ...item,
    id: item.id.toString(),
  }));

  return (
    <>
      <PageHeader
        title="View Purchase Return"
        titleStyle={{ borderBottom: '2px solid #471923', color: '#000' }}
        showDownloadBtn={true}
        showCreateBtn={false}
      />
      <PurchaseCommonView
        Subtitle="Purchase Return"
        dateLabel="Date"
        grnNoLabel="Purchase Return No"
        refNoLabel="Ref No"
        showRefNo={true}
        showRemarks={true}
        tableHeaders={{
          sno: 'S.No',
          materialType: 'Material Type',
          category: 'Category',
          subCategory: 'Sub Category',
          description: 'Product Description',
          purity: 'Purity',
          orderedWeight: 'Quantity',
          receivedWeight: 'Weight',
          rate: 'Rate',
          amount: 'Amount',
        }}
        showPaymentDetails={false}
        companyData={PurchaseReturnsData.companyData}
        supplierData={PurchaseReturnsData.supplierData}
        grnDetails={PurchaseReturnsData.grnDetails}
        grnItems={transformedGrnItems}
        summary={transformedSummary}
        remarks={PurchaseReturnsData.remarks}
      />
    </>
  );
};

export default ViewPurchaseReturn;
