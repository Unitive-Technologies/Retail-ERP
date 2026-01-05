import {
  ActiveStatusIcon,
  AllStatusIcon,
  InActiveStatusIcon,
} from '@assets/Images/AdminImages';
import { contentLayout } from '@components/CommonStyles';
import PageHeader from '@components/PageHeader';
import StatusCard from '@components/StatusCard';
import Grid from '@mui/system/Grid';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import { GridColDef } from '@mui/x-data-grid';
import { ChipComponent, ConfirmModal, MUHTable } from '@components/index';
import { useNavigate } from 'react-router-dom';
import { DeactiveIcon, RowEditIcon, RowViewIcon } from '@assets/Images';
import { CONFIRM_MODAL, HTTP_STATUSES } from '@constants/Constance';
import { useTheme } from '@mui/material';
import { API_SERVICES } from '@services/index';
import { DropDownServiceAll } from '@services/DropDownServiceAll';
import OfferFilter from './OfferFilter';

const Offers = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [offerData, setOfferData] = useState<object[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [counts, setCounts] = useState({ total: 0, active: 0, inactive: 0 });
  const [offerPlans, setOfferPlans] = useState<any[]>([]);

  const initialValues = {
    status: null,
    offer_plan: null,
    search: '',
  };

  const edit = useEdit(initialValues);

  const card = React.useMemo(
    () => [
      {
        img: AllStatusIcon,
        img2: AllStatusIcon,
        title: 'Total Offer',
        value: counts.total,
        activeTab: activeTab,
      },
      {
        img: ActiveStatusIcon,
        img2: ActiveStatusIcon,
        title: 'Active',
        value: counts.active,
        activeTab: activeTab,
      },
      {
        img: InActiveStatusIcon,
        img2: InActiveStatusIcon,
        title: 'In Active',
        value: counts.inactive,
        activeTab: activeTab,
      },
    ],
    [counts.total, counts.active, counts.inactive, activeTab]
  );

  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.39,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
    },
    {
      field: 'offer_id',
      headerName: 'Offer ID',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'offer_plan',
      headerName: 'Offer Plan',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'offer_type',
      headerName: 'Offer Type',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'offer_value',
      headerName: 'Offer Value',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'validity',
      headerName: 'Validity',
      flex: 1.4,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'description',
      headerName: 'Offer Description',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: any) => (
        <Grid container alignItems="center" style={{ height: '100%' }}>
          {(() => {
            const isActive =
              String(row?.status ?? '').toLowerCase() === 'active';
            return (
              <ChipComponent
                label={isActive ? 'Active' : 'Inactive'}
                style={{
                  backgroundColor: isActive
                    ? theme.Colors.primary
                    : theme.Colors.primaryLight,
                  color: isActive
                    ? theme.Colors.whitePrimary
                    : theme.Colors.primary,
                  fontSize: 10,
                  fontWeight: 700,
                  width: 105,
                  height: '24px',
                }}
              />
            );
          })()}
        </Grid>
      ),
    },
  ];

  const onclickActiveTab = (index: number) => {
    setActiveTab(index);
    if (index === 0) {
      edit.update({ status: null });
    } else if (index === 1) {
      edit.update({ status: { label: 'Active', value: 'Active' } }); // Active
    } else if (index === 2) {
      edit.update({ status: { label: 'Inactive', value: 'Inactive' } }); // Inactive
    }
  };

  const handleCustomizeColumn = (hiddenColumns: string[]) => {
    setHiddenColumns([...hiddenColumns]);
  };

  const handleSelectValue = (item: { headerName: never }) => {
    let hiddenCols = [];
    if (hiddenColumns.includes(item.headerName)) {
      hiddenCols = hiddenColumns.filter(
        (field: any) => field !== item.headerName
      );
      setHiddenColumns([...hiddenCols]);
    } else {
      hiddenCols = [...hiddenColumns, item.headerName];
      setHiddenColumns([...hiddenCols]);
    }
    handleCustomizeColumn(hiddenCols);
  };

  const handleFilterClear = () => {
    edit.reset();
    setHiddenColumns([]);
  };

  const handleEditUser = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
      rowId: rowData?.id,
    }).toString();
    navigateTo(`/admin/master/offerCreate/form?${params}`);
  };

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
  };

  const handleDeactive = (_rowData: any) => {};

  const renderRowAction = (rowData: any) => {
    return [
      {
        text: 'Edit',
        renderIcon: () => <RowEditIcon />,
        onClick: () => {
          const props = {
            title: 'Edit',
            description: 'Do you want to modify data?',
            onCancelClick: () => handleCancelModal(),
            color: '#FF742F',
            iconType: CONFIRM_MODAL.edit,
            onConfirmClick: () => handleEditUser(rowData, CONFIRM_MODAL.edit),
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        onClick: () => handleEditUser(rowData, CONFIRM_MODAL.view),
      },
      {
        text: 'Deactive',
        renderIcon: () => <DeactiveIcon />,
        onClick: () => handleDeactive(rowData),
      },
    ];
  };

  useEffect(() => {
    const fetchOfferPlans = async () => {
      try {
        const response: any = await DropDownServiceAll.getOfferPlans();
        const offerPlansData =
          response?.data?.data?.offerPlans || response?.data?.offerPlans || [];

        if (Array.isArray(offerPlansData) && offerPlansData.length > 0) {
          const formattedPlans = offerPlansData.map((plan: any) => ({
            value: plan.id,
            label: plan.plan_name,
          }));
          setOfferPlans(formattedPlans);
        }
      } catch (error: any) {
        console.error('Failed to fetch offer plans:', error);
      }
    };
    fetchOfferPlans();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const statusOpt = edit.getValue('status');
      const statusParam = statusOpt?.label || statusOpt?.value || undefined;
      const search = edit.getValue('search') || undefined;
      const offerPlanOpt = edit.getValue('offer_plan');
      const offerPlanParam = offerPlanOpt?.value || undefined;

      const params: any = {};
      if (statusParam) params.status = statusParam;
      if (search) params.search = search;
      if (offerPlanParam) params.offer_plan_id = offerPlanParam;

      const response: any = await API_SERVICES.OfferService.getAll(params);

      console.log('Full API Response:', response);
      console.log('response.data:', response?.data);
      console.log('response.data.data:', response?.data?.data);

      if (
        response?.data?.statusCode === HTTP_STATUSES.SUCCESS ||
        response?.status < HTTP_STATUSES.BAD_REQUEST
      ) {
        let apiData = null;
        let countsData = null;
        let offersData = [];

        if (response?.data?.data) {
          apiData = response.data.data;
        } else if (response?.data) {
          apiData = response.data;
        } else {
          apiData = response;
        }

        countsData = apiData?.counts || null;
        offersData = apiData?.offers || [];

        if (!countsData && offersData.length > 0) {
          const total = offersData.length;
          const active = offersData.filter(
            (offer: any) =>
              String(offer.status || '').toLowerCase() === 'active'
          ).length;
          const inactive = total - active;

          countsData = {
            total,
            active,
            inactive,
          };
        } else if (!countsData) {
          countsData = {
            total: 0,
            active: 0,
            inactive: 0,
          };
        } else {
          console.log(' API response:', countsData);
        }

        const formattedCounts = {
          total: Number(countsData.total) || 0,
          active: Number(countsData.active) || 0,
          inactive: Number(countsData.inactive) || 0,
        };

        const mappedData = offersData.map((offer: any, index: number) => {
          const validFrom = offer.valid_from
            ? new Date(offer.valid_from).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : '';
          const validTo = offer.valid_to
            ? new Date(offer.valid_to).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : '';
          const validity =
            validFrom && validTo ? `${validFrom} - ${validTo}` : '';

          const offerPlan = offerPlans.find(
            (plan: any) => Number(plan.value) === Number(offer.offer_plan_id)
          );
          const offerPlanName =
            offerPlan?.label || offer.offer_plan_name || offer.plan_name || '-';

          const offerValueDisplay =
            offer.offer_type === 'Percentage'
              ? `${offer.offer_value}%`
              : `₹${parseFloat(offer.offer_value || '0').toLocaleString('en-IN')}`;

          return {
            id: offer.id,
            s_no: index + 1,
            offer_id: offer.offer_code || '',
            offer_plan: offerPlanName,
            offer_type: offer.offer_type || '',
            offer_value: offerValueDisplay,
            validity: validity,
            description: offer.offer_description || '',
            status: offer.status || '',
          };
        });

        setOfferData(mappedData);
        setCounts(formattedCounts);
      } else {
        setOfferData([]);
        setCounts({ total: 0, active: 0, inactive: 0 });
        toast.error(response?.data?.message || 'Failed to fetch offers');
      }
    } catch (err: any) {
      setLoading(false);
      setOfferData([]);
      setCounts({ total: 0, active: 0, inactive: 0 });
      toast.error(err?.message || 'Failed to fetch offers');
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    edit.getValue('status'),
    edit.getValue('search'),
    edit.getValue('offer_plan'),
    offerPlans.length,
  ]);

  return (
    <>
      <Grid container spacing={2}>
        <PageHeader
          title="OFFERS"
          count={offerData.length}
          btnName="Create Offers"
          navigateUrl="/admin/master/offerCreate/form?type=create"
        />

        <StatusCard data={card} onClickCard={onclickActiveTab} />
        <Grid container sx={contentLayout}>
          <OfferFilter
            selectItems={columns}
            selectedValue={hiddenColumns}
            handleSelectValue={handleSelectValue}
            handleFilterClear={handleFilterClear}
            edit={edit}
          />
          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={offerData}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default Offers;
