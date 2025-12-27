import { Typography, useTheme } from '@mui/material';
import PageHeader from '@components/PageHeader';
import {
  AutoSearchSelectWithLabel,
  TextInput,
  styles,
} from '@components/index';
import FormAction from '@components/ProjectCommon/FormAction';
import { useEdit } from '@hooks/useEdit';
import { useLocation, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import { commonTextInputProps } from '@components/CommonStyles';
import { useEffect, useState } from 'react';
import { EmployeeIncentiveService } from '@services/EmployeeIncentiveService';
import toast from 'react-hot-toast';
import TextInputAdornment from '@pages/admin/common/TextInputAdornment';

const CreateIncentives = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const paramType = params.get('type') || null;
  const { rowData = {}, type: stateType } = (location.state || {}) as any;
  const type = stateType || paramType || 'create';
  const isReadOnly = type === 'view';

  const IncentiveInitialValues = {
    role: rowData?.role || '',
    department: rowData?.department || '',
    salesTarget: rowData?.salesTarget || '',
    incentiveType: rowData?.incentiveType || '',
    incentiveValue: rowData?.incentiveValue || '',
    salesTargetMin: rowData?.sales_target?.[0]
      ? Number(rowData.sales_target[0]).toLocaleString('en-IN')
      : '',
    salesTargetMax: rowData?.sales_target?.[1]
      ? Number(rowData.sales_target[1]).toLocaleString('en-IN')
      : '',
  };

  const edit = useEdit(IncentiveInitialValues);

  type DropdownOption = {
    label: string;
    value: string | number;
    sales_target?: number[];
  };

  const [roles, setRoles] = useState<DropdownOption[]>([]);
  const [departments, setDepartments] = useState<DropdownOption[]>([]);
  const [salesTargets, setSalesTargets] = useState<DropdownOption[]>([]);
  const [incentiveTypes, setIncentiveTypes] = useState<DropdownOption[]>([]);

  const normalizeSalesArr = (val: any): number[] => {
    if (!val && val !== 0) return [];
    if (Array.isArray(val)) return val.map((v) => Number(v));
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed.map((v) => Number(v));
      } catch {
        const parts = val.split(',').map((s: string) => Number(s.trim()));
        if (parts.every((n: any) => !isNaN(n))) return parts;
      }
    }
    return [];
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await EmployeeIncentiveService.getAll();
        if (response?.data?.statusCode === 200) {
          const { incentives } = response.data.data;

          const uniqueRoles = Array.from(
            new Map(
              incentives.map((i: any) => [
                i.role_id,
                { label: i.role_name, value: i.role_id },
              ])
            ).values()
          );

          const uniqueDepartments = Array.from(
            new Map(
              incentives.map((i: any) => [
                i.department_id,
                {
                  label: i.department_name,
                  value: i.department_id,
                  sales_target: normalizeSalesArr(i.sales_target),
                },
              ])
            ).values()
          );

          const uniqueIncentiveTypes = Array.from(
            new Map(
              incentives.map((i: any) => [
                i.incentive_type,
                { label: i.incentive_type, value: i.incentive_type },
              ])
            ).values()
          );

          setRoles(uniqueRoles);
          setDepartments(uniqueDepartments);
          setIncentiveTypes(uniqueIncentiveTypes);

          if (rowData && Object.keys(rowData).length) {
            const roleOpt =
              uniqueRoles.find((r) => r.value === rowData.role_id) ||
              uniqueRoles.find((r) => r.label === rowData.role) ||
              '';

            let deptOpt =
              uniqueDepartments.find(
                (d) => d.value === rowData.department_id
              ) ||
              uniqueDepartments.find((d) => d.label === rowData.department);

            if (!deptOpt && rowData.department_id) {
              deptOpt = {
                label:
                  rowData.department_name ||
                  rowData.department ||
                  `Dept ${rowData.department_id}`,
                value: rowData.department_id,
                sales_target: Array.isArray(rowData.sales_target)
                  ? rowData.sales_target
                  : (() => {
                      try {
                        if (
                          typeof rowData.sales_target === 'string' &&
                          rowData.sales_target.trim().startsWith('[')
                        ) {
                          return JSON.parse(rowData.sales_target);
                        }
                      } catch {
                        /* ignore */
                      }
                      return undefined;
                    })(),
              };
            }

            const incTypeOpt =
              uniqueIncentiveTypes.find(
                (t) => t.value === rowData.incentive_type
              ) || '';

            const deptSales = deptOpt
              ? normalizeSalesArr((deptOpt as any).sales_target)
              : [];
            const rowSales = normalizeSalesArr(rowData.sales_target);

            const salesArr = rowSales.length ? rowSales : deptSales;

            const salesOpt =
              Array.isArray(salesArr) && salesArr.length >= 2
                ? {
                    label: `₹ ${Number(salesArr[0]).toLocaleString()} - ₹ ${Number(
                      salesArr[1]
                    ).toLocaleString()}`,
                    value: JSON.stringify(salesArr),
                    sales_target: salesArr,
                  }
                : '';

            setSalesTargets(salesOpt ? [salesOpt] : []);

            const formattedMin =
              Array.isArray(salesArr) && salesArr[0] != null
                ? Number(salesArr[0]).toLocaleString('en-IN')
                : '';
            const formattedMax =
              Array.isArray(salesArr) && salesArr[1] != null
                ? Number(salesArr[1]).toLocaleString('en-IN')
                : '';

            const updates: any = {
              role: roleOpt,
              department: deptOpt || '',
              salesTarget: salesOpt || '',
              salesTargetMin: formattedMin,
              salesTargetMax: formattedMax,
              incentiveType: incTypeOpt,
              incentiveValue: rowData?.incentive_value?.toString?.() || '',
            };
            edit.update(updates);
          }
        }
      } catch (err) {
        console.error('Error fetching dropdowns:', err);
        toast.error('Failed to fetch dropdown data');
      } finally {
      }
    };
    fetchDropdownData();
  }, []);

  const handleDropdownChange = (
    field: string,
    value: DropdownOption | null
  ) => {
    if (field === 'department' && value) {
      const salesArr = value.sales_target ?? [];

      const salesOptions: DropdownOption[] = [];

      if (Array.isArray(salesArr) && salesArr.length >= 2) {
        salesOptions.push({
          label: `₹ ${Number(salesArr[0]).toLocaleString()} - ₹ ${Number(
            salesArr[1]
          ).toLocaleString()}`,
          value: JSON.stringify(salesArr),
          sales_target: salesArr,
        });

        const formattedMin = Number(salesArr[0]).toLocaleString('en-IN');
        const formattedMax = Number(salesArr[1]).toLocaleString('en-IN');

        const updates: any = {
          salesTargetMin: formattedMin,
          salesTargetMax: formattedMax,
        };
        updates['department'] = value;
        updates['salesTarget'] = salesOptions[0] || '';
        edit.update(updates);
      } else {
        edit.update({
          department: value,
          salesTargetMin: '',
          salesTargetMax: '',
          salesTarget: '',
        });
      }
      setSalesTargets(salesOptions);
    }

    if (field !== 'department') {
      edit.update({ [field]: value || '' });
    }
  };

  const handleCreateIncentive = async () => {
    if (isReadOnly) return;

    const incentiveValue = parseFloat(edit.getValue('incentiveValue') || '');
    const selSales = edit.getValue('salesTarget');

    let sales_target: number[] = [];

    try {
      if (!selSales) {
        sales_target = [];
      } else if (Array.isArray(selSales)) {
        sales_target = selSales.map(Number);
        console.log('[CreateNew] selSales is array ->', sales_target);
      } else if (
        selSales.sales_target &&
        Array.isArray(selSales.sales_target)
      ) {
        sales_target = selSales.sales_target.map(Number);
        console.log('[CreateNew] selSales.sales_target ->', sales_target);
      } else if (typeof selSales === 'object' && selSales.value) {
        const parsed = JSON.parse(String(selSales.value));
        sales_target = Array.isArray(parsed)
          ? parsed.map(Number)
          : [Number(parsed)];
        console.log(
          '[CreateNew] parsed selSales.value ->',
          parsed,
          sales_target
        );
      } else if (typeof selSales === 'string') {
        const parsed = JSON.parse(String(selSales));
        sales_target = Array.isArray(parsed)
          ? parsed.map(Number)
          : [Number(parsed)];
        console.log(
          '[CreateNew] selSales string parsed ->',
          parsed,
          sales_target
        );
      }
    } catch {
      sales_target = [];
      console.log(
        '[CreateNew] error parsing selSales -> falling back to manual inputs'
      );
    }

    sales_target = normalizeSalesArr(sales_target);
    console.log(
      '[CreateNew] sales_target after normalize (from selection):',
      sales_target
    );

    const minStr = edit.getValue('salesTargetMin') || '';
    const maxStr = edit.getValue('salesTargetMax') || '';
    const parseNum = (s: string) =>
      Number(String(s).replace(/,/g, '').trim() || NaN);
    const minNum = parseNum(minStr);
    const maxNum = parseNum(maxStr);
    if (!isNaN(minNum) && !isNaN(maxNum)) {
      sales_target = minNum <= maxNum ? [minNum, maxNum] : [maxNum, minNum];
      console.log(
        '[CreateNew] sales_target overridden by manual inputs:',
        sales_target
      );
    }

    const payload = {
      role_id: edit.getValue('role')?.value,
      department_id: edit.getValue('department')?.value,
      incentive_type: edit.getValue('incentiveType')?.value,
      incentive_value: isNaN(incentiveValue) ? NaN : incentiveValue,
      sales_target,
    };

    if (
      !payload.role_id ||
      !payload.department_id ||
      !payload.incentive_type ||
      typeof payload.incentive_value !== 'number' ||
      isNaN(payload.incentive_value) ||
      payload.incentive_value <= 0 ||
      !Array.isArray(payload.sales_target) ||
      payload.sales_target.length === 0
    ) {
      toast.error('Please fill all required fields.');
      return;
    }

    try {
      if (type === 'edit' && rowData?.id) {
        const response = await EmployeeIncentiveService.update(rowData.id, {
          data: payload,
          successMessage: 'Incentive updated successfully!',
          failureMessage: 'Failed to update incentive.',
        });

        if (response?.status === 200 || response?.data?.statusCode === 200) {
          navigate('/admin/master/employee');
        }
      } else {
        const response = await EmployeeIncentiveService.create({
          data: payload,
          successMessage: 'Incentive created successfully!',
          failureMessage: 'Failed to create incentive.',
        });

        if (response?.status === 201 || response?.data?.statusCode === 201) {
          navigate('/admin/master/employee');
        }
      }
    } catch (error) {
      toast.error('Failed to save incentive. Please try again.');
    }
  };

  return (
    <Grid
      container
      flexDirection="column"
      sx={{ flex: 1, minHeight: 0 }}
      spacing={2}
    >
      <PageHeader
        title={
          type === 'create'
            ? 'CREATE INCENTIVES'
            : type === 'edit'
              ? 'EDIT INCENTIVES'
              : 'VIEW INCENTIVES'
        }
        showDownloadBtn={false}
        showCreateBtn={false}
        showlistBtn={true}
        navigateUrl="/admin/master/employee"
      />

      <Grid container size="grow">
        <Grid
          container
          width="100%"
          sx={{
            padding: '20px',
            borderRadius: '8px',
            border: `1px solid ${theme.Colors.grayLight}`,
            alignContent: 'flex-start',
            backgroundColor: theme.Colors.whitePrimary,
          }}
        >
          <Grid
            container
            size={{ xs: 12, md: 12 }}
            sx={{
              borderBottom: `1px solid ${theme.Colors.grayLight}`,
              paddingBottom: '10px',
            }}
          >
            <Typography
              sx={{
                fontSize: theme.MetricsSizes.small_xxx,
                fontWeight: theme.fontWeight.mediumBold,
                color: theme.Colors.black,
                fontFamily: theme.fontFamily.roboto,
              }}
            >
              INCENTIVE DETAILS
            </Typography>
          </Grid>
          {/* DEPARTMENT */}
          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <AutoSearchSelectWithLabel
              label="Department"
              options={departments}
              value={edit.getValue('department')}
              isReadOnly={isReadOnly}
              onChange={(_, option) =>
                !isReadOnly && handleDropdownChange('department', option)
              }
            />
          </Grid>
          {/* ROLE */}
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <AutoSearchSelectWithLabel
              label="Role"
              options={roles}
              value={edit.getValue('role')}
              isReadOnly={isReadOnly}
              onChange={(_, option) =>
                !isReadOnly && handleDropdownChange('role', option)
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <Grid container width={'100%'} mt={'8px'}>
              {/* Label */}
              <Grid size={5}>
                <Typography
                  sx={{
                    fontWeight: theme.fontWeight.medium,
                    fontSize: theme.MetricsSizes.small_xx,
                    color: theme.Colors.black,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  Sales Target
                </Typography>
              </Grid>
              {/* Two Input Fields */}
              <Grid container gap={2} size={'grow'}>
                <Grid size={5.5}>
                  <TextInput
                    {...commonTextInputProps}
                    placeholder="Min Target"
                    value={edit.getValue('salesTargetMin') || ''}
                    disabled={isReadOnly}
                    onChange={(e: any) => {
                      if (isReadOnly) return;
                      const formatted = e.target.value
                        .replace(/[^0-9]/g, '')
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                      edit.update({
                        salesTargetMin: formatted,
                        salesTarget: '',
                      });
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <TextInputAdornment
                            text="₹"
                            width={55}
                            position="start"
                          />
                        ),
                      },
                    }}
                  />
                </Grid>
                {/* Max Target */}
                <Grid size={5.5}>
                  <TextInput
                    {...commonTextInputProps}
                    placeholder="Max Target"
                    value={edit.getValue('salesTargetMax') || ''}
                    disabled={isReadOnly}
                    onChange={(e: any) => {
                      if (isReadOnly) return;
                      const formatted = e.target.value
                        .replace(/[^0-9]/g, '')
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                      edit.update({
                        salesTargetMax: formatted,
                        salesTarget: '',
                      });
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <TextInputAdornment
                            text="₹"
                            width={55}
                            position="start"
                          />
                        ),
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* INCENTIVE TYPE */}
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <AutoSearchSelectWithLabel
              label="Incentive Type"
              options={incentiveTypes}
              value={edit.getValue('incentiveType')}
              isReadOnly={isReadOnly}
              onChange={(_, option) => {
                if (isReadOnly) return;
                edit.update({
                  incentiveType: option,
                  incentiveValue: '',
                });
              }}
            />
          </Grid>

          {/* INCENTIVE VALUE */}
          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <TextInput
              inputLabel="Incentive Value"
              value={edit.getValue('incentiveValue') || ''}
              disabled={isReadOnly}
              onChange={(e: any) =>
                !isReadOnly && edit.update({ incentiveValue: e.target.value })
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <TextInputAdornment
                      text={
                        edit.getValue('incentiveType')?.label === 'Percentage'
                          ? '%'
                          : '₹'
                      }
                      width={
                        edit.getValue('incentiveType')?.label === 'Percentage'
                          ? '57px'
                          : '40px'
                      }
                      position="start"
                    />
                  ),
                },
              }}
              {...commonTextInputProps}
            />
          </Grid>
        </Grid>
      </Grid>

      <FormAction
        firstBtntxt={
          type === 'edit' ? 'Update' : type === 'create' ? 'Create' : 'Edit'
        }
        secondBtntx={type === 'view' ? 'Back' : 'Cancel'}
        handleCreate={handleCreateIncentive}
        handleCancel={() => navigate(-1)}
        disableCreate={type === 'view'}
      />
    </Grid>
  );
};

export default CreateIncentives;
