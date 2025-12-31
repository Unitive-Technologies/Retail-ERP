import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { LandingPage } from './routes';
import ProductCategories from '@pages/landingPages/navigationTabs/ProductCategories';
import Pendants from '@pages/landingPages/navigationTabs/Pendants';
import Gold from '@pages/landingPages/navigationTabs/Gold';
import Silver from '@pages/landingPages/navigationTabs/Silver';
import Necklace from '@pages/landingPages/navigationTabs/Necklace';
import Bangles from '@pages/landingPages/navigationTabs/Bangles';
import Rings from '@pages/landingPages/navigationTabs/Rings';
import Mangalsutra from '@pages/landingPages/navigationTabs/Mangalsutra';
import Home from '@pages/landingPages/home/Home';
import ProductBuy from '@pages/landingPages/ProductDetails/ProductBuy';

import ProfileSideNav from '@pages/landingPages/MyProfile';
import AccountDetails from '@pages/landingPages/MyProfile/AccountDetails';
import Wishlist from '@pages/landingPages/MyProfile/Wishlist';
import MyOrder from '@pages/landingPages/MyProfile/MyOrder';
import MyCart from '@pages/landingPages/MyProfile/MyCart';
import SchemeLandingPage from '@pages/landingPages/schemePages/schemeLandingPage';
import AdminLayout from '@layouts/AdminLayout';
import Dashboard from '@pages/admin/dashboard/Dashboard';
import Schemes from '@pages/admin/master/schemes/Schemes';
import Offers from '@pages/admin/master/offers/Offers';
import TagPrinting from '@pages/admin/master/tagPrinting/TagPrinting';
import Account from '@pages/admin/master/accounts/Account';
import Collections from '@pages/admin/master/collections';
import Employee from '@pages/admin/master/employee/Employee';
import Vendor from '@pages/admin/master/vendor/VendorList';
import MyProfile from '@pages/admin/profile/MyProfile';
import BranchList from '@pages/admin/master/branch/BranchList';
import CountryCreate from '@pages/admin/locationMaster/countryCreate';
import LocationMaster from '@pages/admin/locationMaster';
import StateViewPage from '@pages/admin/locationMaster/stateViewPage';
import DistrictViewPage from '@pages/admin/locationMaster/districtViewPage';
import CreateUomComponent from '@pages/admin/master/uom/CreateUom';
import UOMList from '@pages/admin/master/uom/ListUom';
import MaterialTypeCreate from '@pages/admin/master/collections/materialTypeCreate';
import CreateOffer from '@pages/admin/master/offers/CreateOffer';
import CategoryCreate from '@pages/admin/master/collections/categoryCreate';
import SubCategoryCreate from '@pages/admin/master/collections/subCategoryCreate';
import BranchForm from '@pages/admin/master/branch/BranchForm';
import CreateVendor from '@pages/admin/master/vendor/CreateVendor';
import QuotationList from '@pages/admin/purchaseManagement/quotation/QuotationList';
import PurchaseList from '@pages/admin/purchaseManagement/purchase';
import GrnList from '@pages/admin/purchaseManagement/grn';
import PurchaseReturnList from '@pages/admin/purchaseManagement/purchaseReturns/PurchaseReturnList';
import ProductList from '@pages/admin/master/products/ProductList';
import ProductForm from '@pages/admin/master/products/ProductForm';
import VariantCreate from '@pages/admin/master/collections/variantCreate';
import CreateGrn from '@pages/admin/purchaseManagement/grn/CreateGrn';
import RequestQuotation from '@pages/admin/purchaseManagement/quotation/RequestQuotation';
import LedgerGroupCreate from '@pages/admin/master/accounts/ledgerGroupCreate';
import LedgerCreate from '@pages/admin/master/accounts/ledgerCreate';
import HrEmployeeList from '@pages/admin/HRManagement/employee/HREmployeeList';
import AttendanceList from '@pages/admin/HRManagement/attendance/AttendanceList';
import LeaveList from '@pages/admin/HRManagement/leave/LeaveList';
import HolidaysList from '@pages/admin/HRManagement/holidays/holidaysList';
import IncentivesList from '@pages/admin/HRManagement/incentives/incentivesList';
import PayrollList from '@pages/admin/HRManagement/payroll/PayrollList';
import CreateEmployee from '@pages/admin/master/employee/CreateEmployee';
import CreateRole from '@pages/admin/master/employee/CreateRole';
import CreateNew from '@pages/admin/master/employee/CreateNew';
import CompareQuotation from '@pages/admin/purchaseManagement/quotation/CompareQuotation';
import ViewQuotation from '@pages/admin/purchaseManagement/quotation/ViewQuotation';
import HrEmployeeDetails from '@pages/admin/HRManagement/employee/HREmployeeDetails';
import ViewGrn from '@pages/admin/purchaseManagement/grn/ViewGrn';
import Customer from '@pages/admin/master/Customer/Customer';
import CreateCustomer from '@pages/admin/master/Customer/CreateCustomer';
import CustomerOrder from '@pages/admin/master/Customer/CustomerOrder';
import CreatePurchaseOrder from '@pages/admin/purchaseManagement/purchase/CreatePurchaseOrder';
import ViewPurchaseOrder from '@pages/admin/purchaseManagement/purchase/ViewPurchaseOrder';
import CreatePurchaseReturn from '@pages/admin/purchaseManagement/purchaseReturns/CreatePurchaseReturns';
import ViewPurchaseReturn from '@pages/admin/purchaseManagement/purchaseReturns/ViewPurchaseReturn';
import ProductViewPage from '@pages/admin/master/ProductView/ProductViewPage';
import HrEmployeePayrollView from '@pages/admin/HRManagement/employee/HREmployeePayrollView';
import SchemeDetails from '@pages/admin/master/Customer/SchemeDetails';
import CreateScheme from '@pages/admin/master/schemes/createScheme';
import ViewInvoice from '@pages/admin/master/Customer/ViewInvoice';
import SavingSchemeView from '@pages/admin/master/Customer/SavingSchemeView';
import ViewScheme from '@pages/admin/master/schemes/viewScheme';
import CreateHoliday from '@pages/admin/HRManagement/holidays/CreateHoliday';
import OnlineOrder from '@pages/admin/master/OnlineOrder/OnlineOrder';
import SavingScheme from '@pages/admin/master/SavingScheme/SavingSchemeList';
import Stock from '@pages/admin/master/StockManagement/Stock';
import StockTransfer from '@pages/admin/master/StockManagement/StockTransfer';
import SalesManagement from '@pages/admin/master/SalesManagement/SalesManagement';
import Revenue from '@pages/admin/master/Revenue/Revenue';
import AssetManagement from '@pages/admin/master/AssetManagement/AssetManagement';
import JournalEntry from '@pages/admin/master/JournalEntry/JournalEntry';
import VoucherPayments from '@pages/admin/master/Voucher/VoucherPayments';
import VoucherReceipt from '@pages/admin/master/Voucher/VoucherReceipt';
import PurchaseReport from '@pages/admin/master/Reports/purchaseReport';
import CreatePayroll from '@pages/admin/HRManagement/payroll/CreatePayroll';
import ViewPayroll from '@pages/admin/HRManagement/payroll/ViewPayroll';
import StateCreatePage from '@pages/admin/locationMaster/stateCreatePage';
import DistrictCreate from '@pages/admin/locationMaster/districtCreate';
import CreateJournal from '@pages/admin/master/JournalEntry/CreateJournal';
import PaymentCreation from '@pages/admin/master/Voucher/PaymentCreation';
import ViewPayment from '@pages/admin/master/Voucher/ViewPayment';
import CreateReceipt from '@pages/admin/master/Voucher/CreateReceipt';
import AbandonedCheckout from '@pages/admin/master/Reports/abandonedCheckout';
import RevenueBranchFilter from '@pages/admin/master/Revenue/RevenueBranchFilter';
import CreateAsset from '@pages/admin/master/AssetManagement/CreateAsset';
import ViewAsset from '@pages/admin/master/AssetManagement/ViewAsset';
import AddMaintenance from '@pages/admin/master/AssetManagement/AddMaintenance';
import AssetScrap from '@pages/admin/master/AssetManagement/AssetScrap';
import OrderViewPage from '@pages/admin/master/OnlineOrder/OrderViewPage';
import CreateNewEnrolment from '@pages/admin/master/SavingScheme/CreateNewEnrolment';
import ViewSavingScheme from '@pages/admin/master/SavingScheme/ViewSavingScheme';
import BranchWiseList from '@pages/admin/master/StockManagement/BranchWiseList';
import BranchWiseStock from '@pages/admin/master/StockManagement/BranchWiseStock';
import StockList from '@pages/admin/master/StockManagement/StockList';
import CreateStockTransfer from '@pages/admin/master/StockManagement/CreateStockTransfer';
import ViewStockTransfer from '@pages/admin/master/StockManagement/ViewStockTransfer';
import BranchWiseSales from '@pages/admin/master/SalesManagement/BranchWiseSales';
import SalesInvoice from '@pages/admin/master/SalesManagement/SalesInvoice';
import SalesReturn from '@pages/admin/master/SalesManagement/SalesReturn/SalesReturn';
import BranchOverView from '@pages/admin/master/SalesManagement/BranchOverView';
import TaxInvoice from '@pages/admin/master/SalesManagement/TaxInvoice';
import SalesReturnBill from '@pages/admin/master/SalesManagement/SalesReturn/SalesReturnBill';
import VendorOverview from '@pages/admin/Vendor/VendorOverview';
import VendorListTable from '@pages/admin/Vendor/VendorListTable';
import BranchOverview from '@pages/admin/master/BranchFlow/branchOverview';
import BranchListTable from '@pages/admin/master/BranchFlow/BranchListTable';
import Overview from '@pages/admin/Vendor/Overview';
import TransactionHistory from '@pages/admin/Vendor/TransactionHistory';
import OverViewDashboard from '@pages/admin/master/BranchFlow/OverViewTab/OverViewDashboard';
import OverView from '@pages/admin/master/BranchFlow/OverViewTab/OverView';
import BranchCustomerView from '@pages/admin/master/BranchFlow/CustomerTab/BranchCustomerView';
import BranchVendorView from '@pages/admin/master/BranchFlow/VendorTab/BranchVendorView';
import { Checkout } from '@pages/landingPages/checkoutPage';

const createRoutes = () => {
  return createBrowserRouter([
    {
      path: '',
      element: <AuthLayout />,
      children: [
        {
          path: '/',
          element: <Navigate to="home" replace />,
        },

        {
          path: 'home',
          element: <LandingPage />,
          children: [
            {
              path: 'checkout',
              element: <Checkout />,
            },
            { index: true, element: <Home /> },
            { path: 'category/:categoryId', element: <ProductCategories /> },
            {
              path: 'category/:categoryId/subcategory/:subcategoryId',
              element: <ProductCategories />,
            },
            {
              path: 'category/:categoryId/productdetails',
              element: <ProductBuy />,
            },
            // { path: 'earrings', element: <ProductCategories /> },
            // { path: 'gold', element: <Gold /> },
            // { path: 'silver', element: <Silver /> },
            // { path: 'pendants', element: <Pendants /> },
            // { path: 'necklace', element: <Necklace /> },
            // { path: 'bangles', element: <Bangles /> },
            // { path: 'rings', element: <Rings /> },
            // { path: 'mangalsutra', element: <Mangalsutra /> },
            // { path: 'earrings/:option', element: <ProductCategories /> },
            { path: ':productName/productdetails', element: <ProductBuy /> },
            { path: 'profile', element: <ProfileSideNav /> },
            { path: 'profile/accountDetails', element: <ProfileSideNav /> },
            { path: 'profile/myCart', element: <ProfileSideNav /> },
            { path: 'profile/myOrders', element: <ProfileSideNav /> },
            { path: 'profile/wishlist', element: <ProfileSideNav /> },
            { path: 'schemePages', element: <SchemeLandingPage /> },
            {
              path: 'profile',
              element: <AccountDetails />,
              children: [
                {
                  index: true,
                  element: <AccountDetails />,
                },
                { path: 'home/myOrders', element: <MyOrder /> },
                { path: 'profile/wishlist', element: <Wishlist /> },
                { path: 'profile/myCart', element: <MyCart /> },
              ],
            },
          ],
        },
      ],
    },
    {
      path: 'products',
      element: <LandingPage />,
      children: [
        { index: true, element: <Home /> },
        { path: 'view', element: <ProductViewPage /> },
      ],
    },
    {
      path: 'admin',
      element: <AdminLayout />,
      children: [
        { path: 'myProfile', element: <MyProfile /> },
        { path: 'locationMaster', element: <LocationMaster /> },
        { path: 'countryCreate/form', element: <CountryCreate /> },
        { path: 'locationMaster/stateView', element: <StateViewPage /> },
        { path: 'locationMaster/districtView', element: <DistrictViewPage /> },
        { path: 'locationMaster/stateCreate', element: <StateCreatePage /> },
        { path: 'locationMaster/districtCreate', element: <DistrictCreate /> },

        { path: 'dashboard', element: <Dashboard /> },
        { path: 'offerList', element: <Offers /> },
        { path: 'master/branch', element: <BranchList /> },
        { path: 'master/offerCreate/form', element: <CreateOffer /> },
        { path: 'master/branch/form', element: <BranchForm /> },
        { path: 'master/vendorList', element: <Vendor /> },
        { path: 'master/vendorCreate/form', element: <CreateVendor /> },
        { path: 'master/employee', element: <Employee /> },
        { path: 'master/employee/form', element: <CreateEmployee /> },
        { path: 'master/employee/role', element: <CreateRole /> },
        { path: 'master/employee/new', element: <CreateNew /> },

        { path: 'customer', element: <Customer /> },
        { path: 'customer/form', element: <CreateCustomer /> },
        { path: 'customer/order', element: <CustomerOrder /> },
        { path: 'customer/savingScheme', element: <SchemeDetails /> },
        { path: 'customer/savingScheme/view', element: <SavingSchemeView /> },
        { path: 'customer/viewInvoice', element: <ViewInvoice /> },
        { path: 'master/collections', element: <Collections /> },
        { path: 'onlineOrder', element: <OnlineOrder /> },
        { path: 'onlineOrder/view', element: <OrderViewPage /> },
        { path: 'savingScheme', element: <SavingScheme /> },
        { path: 'savingScheme/create', element: <CreateNewEnrolment /> },
        { path: 'savingScheme/view', element: <ViewSavingScheme /> },
        { path: 'stock', element: <Stock /> },
        { path: 'stock/branchWise', element: <BranchWiseList /> },
        {
          path: 'stock/branchWise/branchWiseStock',
          element: <BranchWiseStock />,
        },
        {
          path: 'stock/branchWise/StockList',
          element: <StockList />,
        },
        { path: 'vendorOverview', element: <VendorOverview /> },
        {
          path: 'vendorOverview/vendorListTable',
          element: <VendorListTable />,
        },
        {
          path: 'vendorOverview/vendorListTable/overview',
          element: <Overview />,
        },
        {
          path: 'vendorOverview/transactionHistory',
          element: <TransactionHistory />,
        },
        { path: 'stock/transfer', element: <StockTransfer /> },
        { path: 'stock/transfer/create', element: <CreateStockTransfer /> },
        { path: 'stock/transfer/view', element: <ViewStockTransfer /> },
        { path: 'branch/overview', element: <BranchOverview /> },
        { path: 'branch/list', element: <BranchListTable /> },
        { path: 'branch/filterList', element: <OverViewDashboard /> },
        { path: 'branch/overViewList', element: <OverView /> },
        { path: 'branch/customerView', element: <BranchCustomerView /> },
        { path: 'branch/vendorList', element: <BranchVendorView /> },

        { path: 'salesManagement', element: <SalesManagement /> },

        { path: 'salesManagement/branch', element: <BranchWiseSales /> },
        { path: 'salesManagement/sales', element: <SalesInvoice /> },
        { path: 'salesManagement/salesReturn', element: <SalesReturn /> },
        {
          path: 'salesManagement/salesReturn/bill',
          element: <SalesReturnBill />,
        },

        { path: 'salesManagement/branchView', element: <BranchOverView /> },
        { path: 'salesManagement/taxInvoice', element: <TaxInvoice /> },

        { path: 'revenue', element: <Revenue /> },
        { path: 'revenue/branch', element: <RevenueBranchFilter /> },

        { path: 'assetManagement', element: <AssetManagement /> },
        { path: 'assetManagement/create', element: <CreateAsset /> },
        { path: 'assetManagement/view', element: <ViewAsset /> },
        {
          path: 'assetManagement/view/addMaintenance',
          element: <AddMaintenance />,
        },
        {
          path: 'assetManagement/create/AssetScrap',
          element: <AssetScrap />,
        },

        { path: 'journalEntry', element: <JournalEntry /> },
        { path: 'journalEntry/create', element: <CreateJournal /> },
        { path: 'voucher', element: <VoucherPayments /> },
        { path: 'voucher/create', element: <PaymentCreation /> },
        { path: 'voucher/view', element: <ViewPayment /> },
        { path: 'voucher/receipt', element: <VoucherReceipt /> },
        { path: 'voucher/receipt/create', element: <CreateReceipt /> },

        { path: 'reports/abandonedCheckout', element: <AbandonedCheckout /> },
        { path: 'reports/purchaseReport', element: <PurchaseReport /> },

        {
          path: 'master/collections/materialType/form',
          element: <MaterialTypeCreate />,
        },
        {
          path: 'master/collections/category/form',
          element: <CategoryCreate />,
        },
        {
          path: 'master/collections/subCategory/form',
          element: <SubCategoryCreate />,
        },
        { path: 'master/collections/variant/form', element: <VariantCreate /> },
        { path: 'master/uom', element: <UOMList /> },
        { path: 'master/uom/form', element: <CreateUomComponent /> },
        { path: 'master/products', element: <ProductList /> },
        { path: 'master/product/form', element: <ProductForm /> },
        { path: 'master/accounts', element: <Account /> },
        {
          path: 'master/accounts/ledgerGroup/form',
          element: <LedgerGroupCreate />,
        },
        { path: 'master/accounts/ledger/form', element: <LedgerCreate /> },
        { path: 'master/tagPrinting', element: <TagPrinting /> },
        { path: 'master/offers', element: <Offers /> },
        { path: 'master/schemes', element: <Schemes /> },
        { path: 'master/createScheme/form', element: <CreateScheme /> },
        { path: 'master/schemes/view', element: <ViewScheme /> },

        { path: 'purchases/quotation', element: <QuotationList /> },
        {
          path: 'purchases/requestQuotation/form',
          element: <RequestQuotation />,
        },
        {
          path: 'purchase/compareQuotation/form',
          element: <CompareQuotation />,
        },
        { path: 'purchases/viewQuotation/form', element: <ViewQuotation /> },
        { path: 'purchases/purchase', element: <PurchaseList /> },
        {
          path: 'purchases/purchase/createPurchaseOrder',
          element: <CreatePurchaseOrder />,
        },

        {
          path: 'purchases/purchase/viewPurchaseOrder',
          element: <ViewPurchaseOrder />,
        },
        { path: 'purchases/grn', element: <GrnList /> },
        { path: 'purchases/grn/createGrn', element: <CreateGrn /> },
        { path: 'purchases/grn/viewGrn', element: <ViewGrn /> },
        { path: 'purchases/return', element: <PurchaseReturnList /> },
        {
          path: 'purchases/return/createPurchaseReturn',
          element: <CreatePurchaseReturn />,
        },

        {
          path: 'purchases/return/viewPurchaseReturn',
          element: <ViewPurchaseReturn />,
        },
        { path: 'hr/employee', element: <HrEmployeeList /> },
        { path: 'hr/employee/details', element: <HrEmployeeDetails /> },
        {
          path: 'hr/employee/details/viewpayroll',
          element: <HrEmployeePayrollView />,
        },
        { path: 'hr/attendance', element: <AttendanceList /> },
        { path: 'hr/leaves', element: <LeaveList /> },
        { path: 'hr/holidays', element: <HolidaysList /> },
        { path: 'hr/holidays/create', element: <CreateHoliday /> },
        { path: 'hr/incentives', element: <IncentivesList /> },
        { path: 'hr/payroll', element: <PayrollList /> },
        { path: 'hr/payroll/create', element: <CreatePayroll /> },
        { path: 'hr/payroll/view', element: <ViewPayroll /> },
      ],
    },
  ]);
};

export default createRoutes;
