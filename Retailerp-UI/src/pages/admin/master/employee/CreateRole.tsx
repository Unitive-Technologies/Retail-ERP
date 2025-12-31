import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PageHeader from '@components/PageHeader';
import FormAction from '@components/ProjectCommon/FormAction';
import Grid from '@mui/material/Grid2';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileCard from '@components/ProjectCommon/ProfileCard';
import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import { styles, TextInput } from '@components/index';
import { EmpDepartmentService } from '@services/EmpDepartmentService';
import { RolePermissionService } from '@services/RolePermissionService';
import { HTTP_STATUSES } from '@constants/Constance';
import { commonTextInputProps } from '@components/CommonStyles';
import { useEdit } from '@hooks/useEdit';
import { EmpDesignationDropdownService } from '@services/EmpDesignationDropdownService';
import { EmployeeDepAddService } from '@services/EmployeeDepAddService';
import RoleCreateService from '@services/RoleCreateService';
import { EmployeePermissionService } from '@services/EmployeePermissionService';

const RoleAccessPage = () => {
  const navigateTo = useNavigate();
  const theme = useTheme();
  const [departmentOptions, setDepartmentOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [deptDialogOpen, setDeptDialogOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [isCreatingDept, setIsCreatingDept] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const locationState: any = location.state || {};

  const mode = searchParams.get('type') || locationState?.type || null; // 'edit' | 'view' | 'update-permission' | null

  const selectedDepartmentId = searchParams.get('department_id');
  const selectedRoleName = searchParams.get('role_name');

  const employeeData = locationState?.employeeData;

  const departmentIdFromState =
    locationState?.department_id ||
    employeeData?.department_id ||
    employeeData?.departmentId ||
    null;

  const effectiveDepartmentId =
    selectedDepartmentId ||
    (departmentIdFromState != null ? String(departmentIdFromState) : null);

  const roleNameFromState =
    selectedRoleName ||
    locationState?.role_name ||
    employeeData?.role_name ||
    employeeData?.role ||
    employeeData?.designation_name ||
    employeeData?.designation ||
    null;

  const isViewMode = mode === 'view';
  const isDepartmentReadOnly =
    isViewMode || mode === 'edit' || mode === 'update-permission';

  const employeeProfileData = employeeData
    ? {
        name: employeeData.employee_name || employeeData.name || 'N/A',
        code: employeeData.employee_no || employeeData.code || 'N/A',
        department:
          employeeData.department_name || employeeData.department || 'N/A',
        designation:
          employeeData.designation_name || employeeData.designation || 'N/A',
        dateOfJoining:
          employeeData.joining_date || employeeData.dateOfJoining || 'N/A',
        avatar: employeeData.profile_image_url || employeeData.image || '',
      }
    : null;

  const initialValues = {
    status: 0,
    location: '',
    search: '',
    role_name: '',
    department: undefined as any,
  };

  const edit = useEdit(initialValues);

  const fetchDepartments = useCallback(async () => {
    try {
      const res: any = await EmpDepartmentService.getDepartmentsDropdown();

      const data = res?.data ?? res;
      if (Array.isArray(data?.data)) {
        const options = data.data.map((dept: any) => ({
          label: dept.name || dept.department_name,
          value: dept.id?.toString() ?? '',
        }));
        setDepartmentOptions(options);
      } else if (Array.isArray(data?.data?.departments)) {
        const options = data.data.departments.map((dept: any) => ({
          label: dept.name || dept.department_name,
          value: dept.id?.toString() ?? '',
        }));
        setDepartmentOptions(options);
      } else {
        setDepartmentOptions([]);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
      setDepartmentOptions([]);
    }
  }, []);

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        await EmpDesignationDropdownService.getDesignations();
      } catch (err) {
        console.error('Error fetching designations:', err);
      }
    };

    fetchDesignations();
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleCreateDepartment = async (departmentName: string) => {
    try {
      setIsCreatingDept(true);
      const res: any = await EmployeeDepAddService.create({
        department_name: departmentName.trim(),
      });

      const status = (res as any)?.status ?? (res as any)?.statusCode;
      if (status && status < HTTP_STATUSES.BAD_REQUEST) {
        await fetchDepartments();

        return {
          success: true,
          data: {
            id: res.data?.data?.id,
            name: departmentName.trim(),
          },
          message: res.data?.message || 'Department created successfully',
        };
      } else {
        return {
          success: false,
          message: res?.data?.message || 'Failed to create department',
        };
      }
    } catch (error: any) {
      console.error('Error creating department:', error);
      return {
        success: false,
        message: error?.message || 'Failed to create department',
      };
    } finally {
      setIsCreatingDept(false);
    }
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const groupMap: Record<number, string> = {
          1: 'GENERAL',
          2: 'MASTER',
          3: 'PURCHASE MANAGEMENT',
          4: 'HR MANAGEMENT',
        };
        const groupIds = Object.keys(groupMap).map((k) => Number(k));

        const results = await Promise.all(
          groupIds.map(async (gid) => {
            const resp: any = await RolePermissionService.getModules({
              groupId: gid,
            });

            const data = resp?.data ?? resp;
            const modulesArr = Array.isArray(data?.data?.modules)
              ? data?.data?.modules
              : Array.isArray(data?.modules)
                ? data?.modules
                : [];

            return {
              title: groupMap[gid],
              modules: modulesArr,
            };
          })
        );

        const validResults = results.filter(
          (result) => result.modules && result.modules.length > 0
        );

        setSections(validResults);
        // Set all sections as expanded by default
        const allSectionTitles = new Set(
          validResults.map((result) => result.title)
        );
        setExpandedSections(allSectionTitles);
      } catch (e) {
        console.error('Error fetching modules:', e);
        setSections([]);
      }
    };

    fetchModules();
  }, []);

  const [sections, setSections] = useState<{ title: string; modules: any[] }[]>(
    []
  );

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  const [accessData, setAccessData] = useState<Record<string, any>>({});

  const [permissionIdMap, setPermissionIdMap] = useState<
    Record<string, number>
  >({});

  const permissionsLoadedRef = useRef<string>('');

  useEffect(() => {
    if (!sections?.length) return;

    const state = sections.reduce(
      (acc, section) => {
        const moduleAccess: Record<string, any> = {};

        section.modules?.forEach((module: any) => {
          if (module?.module_name) {
            moduleAccess[module.module_name] = {
              full: false,
              read: false,
              write: false,
              edit: false,
              moduleId: module.id || module.module_id,
            };
          }
        });

        acc[section.title] = {
          checked: false,
          modules: moduleAccess,
        };

        return acc;
      },
      {} as Record<string, any>
    );

    setAccessData(state);
  }, [sections]);

  useEffect(() => {
    if (!mode && !roleNameFromState) return;

    if (roleNameFromState) {
      edit.update({ role_name: roleNameFromState });
    }
  }, [mode, roleNameFromState]);

  useEffect(() => {
    if (!effectiveDepartmentId || !departmentOptions.length) return;

    const match = departmentOptions.find(
      (opt) => opt.value?.toString() === effectiveDepartmentId.toString()
    );
    if (match) {
      edit.update({ department: match });
    }
  }, [mode, selectedDepartmentId, departmentOptions]);

  useEffect(() => {
    const loadExistingPermissions = async () => {
      if (!mode || !effectiveDepartmentId || !roleNameFromState) return;
      if (!sections?.length) return;

      if (!accessData || Object.keys(accessData).length === 0) {
        return;
      }

      const loadKey = `${mode}_${effectiveDepartmentId}_${roleNameFromState}`;

      if (permissionsLoadedRef.current === loadKey) {
        return;
      }

      try {
        let modules: any[] = [];

        const isEmployeeUpdate =
          mode === 'update-permission' && employeeData?.id;

        if (isEmployeeUpdate) {
          const empModules = await EmployeePermissionService.get(
            employeeData.id
          );
          modules = Array.isArray(empModules) ? empModules : [];

          if (!modules.length) {
            const roleRes: any = await RolePermissionService.getRolePermissions(
              {
                department_id: effectiveDepartmentId,
                role_name: roleNameFromState,
              }
            );
            const roleData = roleRes?.data ?? roleRes;
            modules =
              roleData?.data?.data?.modules ??
              roleData?.data?.modules ??
              roleData?.modules ??
              [];
          }
        } else {
          const res: any = await RolePermissionService.getRolePermissions({
            department_id: effectiveDepartmentId,
            role_name: roleNameFromState,
          });

          const data = res?.data ?? res;
          modules =
            data?.data?.data?.modules ??
            data?.data?.modules ??
            data?.modules ??
            [];
        }

        if (!Array.isArray(modules) || !modules.length) {
          permissionsLoadedRef.current = loadKey;
          return;
        }

        setAccessData((currentAccessData) => {
          const updatedAccessData = { ...currentAccessData };
          const newPermissionIdMap: Record<string, number> = {};

          modules.forEach((perm: any) => {
            const groupName = perm.module_group_name || '';

            const sectionTitle = Object.keys(updatedAccessData).find(
              (title) =>
                title.toLowerCase() === groupName.toLowerCase() ||
                title.toLowerCase() ===
                  (groupName || '').toString().toLowerCase()
            );

            if (!sectionTitle) return;

            const moduleName = perm.module_name;
            const accessLevelId = perm.access_level_id;
            const moduleId = perm.module_id || perm.moduleId;

            const moduleState =
              updatedAccessData[sectionTitle]?.modules?.[moduleName];

            if (!moduleState) return;

            // Store permission ID for updates (key: "moduleId_accessLevelId")
            if (perm.id && moduleId) {
              const key = `${moduleId}_${accessLevelId}`;
              newPermissionIdMap[key] = perm.id;
            }

            if (accessLevelId === 1) {
              moduleState.read = true;
            } else if (accessLevelId === 2) {
              moduleState.write = true;
              moduleState.edit = true;
            } else if (accessLevelId === 3) {
              moduleState.full = true;
              moduleState.read = true;
              moduleState.write = true;
              moduleState.edit = true;
            }
          });

          setPermissionIdMap(newPermissionIdMap);

          Object.keys(updatedAccessData).forEach((sectionTitle) => {
            const modulesMap = updatedAccessData[sectionTitle]?.modules || {};
            const allModulesFullyChecked = Object.values(modulesMap).every(
              (m: any) => m.full && m.read && m.edit
            );
            updatedAccessData[sectionTitle].checked = allModulesFullyChecked;
          });

          return updatedAccessData;
        });

        permissionsLoadedRef.current = loadKey;
      } catch (error) {
        console.error('Error loading existing permissions:', error);
      }
    };

    loadExistingPermissions();
  }, [
    mode,
    effectiveDepartmentId,
    roleNameFromState,
    sections,
    accessData,
    employeeData?.id,
  ]);

  useEffect(() => {
    permissionsLoadedRef.current = '';
  }, [mode, effectiveDepartmentId, roleNameFromState]);

  const handleSectionCheck = (sectionTitle: string) => {
    if (isViewMode) return;
    const current = accessData[sectionTitle]?.checked || false;
    const newChecked = !current;

    const updatedModules = Object.fromEntries(
      Object.entries(accessData[sectionTitle]?.modules || {}).map(
        ([mod, moduleData]: [string, any]) => [
          mod,
          {
            ...moduleData,
            full: newChecked,
            read: newChecked,
            write: newChecked,
            edit: newChecked,
          },
        ]
      )
    );

    setAccessData({
      ...accessData,
      [sectionTitle]: {
        checked: newChecked,
        modules: updatedModules,
      },
    });
  };

  const handleAccessChange = (
    sectionTitle: string,
    module: string,
    type: string
  ) => {
    if (isViewMode) return;
    const currentModule = accessData[sectionTitle]?.modules?.[module];
    if (!currentModule) return;

    let updatedModule = {
      ...currentModule,
      [type]: !currentModule[type],
    };

    if (type === 'full') {
      const newState = !currentModule[type];
      updatedModule = {
        ...currentModule,
        full: newState,
        read: newState,
        write: newState,
        edit: newState,
      };
    } else {
      if (type === 'read' || type === 'edit') {
        const readChecked =
          type === 'read' ? updatedModule.read : currentModule.read;
        const editChecked =
          type === 'edit' ? updatedModule.edit : currentModule.edit;

        updatedModule.full = readChecked && editChecked;
      }
    }

    const updatedModules = {
      ...accessData[sectionTitle]?.modules,
      [module]: updatedModule,
    };

    const allChecked = Object.values(updatedModules).every(
      (m: any) => m.full && m.read && m.edit
    );

    setAccessData({
      ...accessData,
      [sectionTitle]: {
        checked: allChecked,
        modules: updatedModules,
      },
    });
  };

  const handleHeaderCheckboxChange = (sectionTitle: string, type: string) => {
    if (isViewMode) return;
    const currentSectionModules = accessData[sectionTitle]?.modules;
    if (!currentSectionModules) return;

    const allSelected = Object.values(currentSectionModules).every(
      (module: any) => module[type]
    );

    const newValue = !allSelected;

    const updatedModules = Object.fromEntries(
      Object.entries(currentSectionModules).map(
        ([mod, moduleData]: [string, any]) => {
          let updatedModule = { ...moduleData };

          if (type === 'full') {
            updatedModule = {
              ...moduleData,
              full: newValue,
              read: newValue,
              write: newValue,
              edit: newValue,
            };
          } else {
            updatedModule[type] = newValue;

            if (type === 'read' || type === 'edit') {
              const readChecked =
                type === 'read' ? updatedModule.read : moduleData.read;
              const editChecked =
                type === 'edit' ? updatedModule.edit : moduleData.edit;
              updatedModule.full = readChecked && editChecked;
            }
          }

          return [mod, updatedModule];
        }
      )
    );

    const allModulesFullyChecked = Object.values(updatedModules).every(
      (m: any) => m.full && m.read && m.edit
    );

    setAccessData({
      ...accessData,
      [sectionTitle]: {
        checked: allModulesFullyChecked,
        modules: updatedModules,
      },
    });
  };

  const areAllModulesChecked = (sectionTitle: string, type: string) => {
    const modules = accessData[sectionTitle]?.modules;
    if (!modules) return false;

    return Object.values(modules).every((module: any) => module[type]);
  };

  const handleToggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionTitle)) {
        newSet.delete(sectionTitle);
      } else {
        newSet.add(sectionTitle);
      }
      return newSet;
    });
  };

  const isSectionExpanded = (sectionTitle: string) => {
    return expandedSections.has(sectionTitle);
  };

  const validatePermissions = () => {
    const hasAnyPermissions = Object.values(accessData).some((section: any) =>
      Object.values(section?.modules || {}).some(
        (module: any) => module.full || module.read || module.edit
      )
    );

    if (!hasAnyPermissions) {
      toast.error('Please grant at least one permission before saving');
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    try {
      const roleName = (edit.getValue('role_name') || '').trim();
      if (!roleName) {
        toast.error('Please enter a role name');
        return;
      }

      if (!validatePermissions()) {
        return;
      }

      const dept = edit.getValue('department');
      let department_id: number | undefined;

      if (dept?.value?.startsWith('new_')) {
        const deptName = dept.label.trim();
        if (!deptName) {
          toast.error('Please enter a valid department name');
          return;
        }

        const result = await handleCreateDepartment(deptName);

        if (result.success && result.data?.id) {
          department_id = Number(result.data.id);

          const newOption = {
            label: deptName,
            value: String(result.data.id),
          };

          edit.update({ department: newOption });
        } else {
          toast.error(result.message || 'Failed to create new department');
          return;
        }
      } else if (dept?.value) {
        department_id = Number(dept.value);
      }

      if (!department_id) {
        toast.error('Please select a department');
        return;
      }

      const isEmployeeUpdate = mode === 'update-permission' && employeeData?.id;

      if (isEmployeeUpdate) {
        const permissions: Array<{
          module_id: number;
          access_level_id: number;
        }> = [];

        Object.entries(accessData).forEach(([_, section]) => {
          Object.values(section.modules).forEach((moduleData: any) => {
            const { moduleId, full, read, write, edit } = moduleData;

            // Determine the highest access level (only create one permission per module)
            let accessLevelId: number | null = null;
            if (full) {
              accessLevelId = 3; // Full Access
            } else if (write || edit) {
              accessLevelId = 2; // Write/Edit
            } else if (read) {
              accessLevelId = 1; // Read
            }

            if (accessLevelId !== null) {
              permissions.push({
                module_id: moduleId,
                access_level_id: accessLevelId,
              });
            }
          });
        });

        const employeePayload = {
          department_id,
          role_name: roleName,
          permissions: permissions,
        };

        const employeeRes: any = await EmployeePermissionService.update(
          employeeData.id,
          employeePayload
        );

        const employeeStatus = employeeRes?.status ?? employeeRes?.statusCode;
        if (employeeStatus && employeeStatus < HTTP_STATUSES.BAD_REQUEST) {
          toast.success('Employee permissions updated successfully');
          navigateTo('/admin/master/employee');
          return;
        }

        throw new Error(
          employeeRes?.data?.message || 'Failed to update employee permissions'
        );
      } else if (mode && (mode === 'edit' || mode === 'update-permission')) {
        // Handle role permission update (mixed create + update)
        const permissions: Array<{
          id?: number;
          module_id: number;
          access_level_id: number;
          role_name?: string;
          department_id?: number;
        }> = [];

        Object.entries(accessData).forEach(([_, section]) => {
          Object.values(section.modules).forEach((moduleData: any) => {
            const { moduleId, full, read, write, edit } = moduleData;

            let accessLevelId: number | null = null;
            if (full) {
              accessLevelId = 3; // Full Access
            } else if (write || edit) {
              accessLevelId = 2; // Write/Edit
            } else if (read) {
              accessLevelId = 1; // Read
            }

            if (accessLevelId !== null) {
              const key = `${moduleId}_${accessLevelId}`;
              const permissionId = permissionIdMap[key];
              const perm: any = {
                module_id: moduleId,
                access_level_id: accessLevelId,
              };

              if (permissionId) {
                perm.id = permissionId;
              } else {
                perm.role_name = roleName;
                perm.department_id = department_id;
              }

              permissions.push(perm);
            }
          });
        });

        if (
          permissions.length === 0 &&
          mode === 'update-permission' &&
          employeeData?.id
        ) {
          try {
            const empModules = await EmployeePermissionService.get(
              employeeData.id
            );

            // Collapse multiple entries per module to the highest access level
            const moduleAccessMap: Record<number, number> = {};
            (empModules || []).forEach((perm: any) => {
              const moduleId = perm.module_id;
              const accessLevelId = perm.access_level_id;

              if (!moduleId || !accessLevelId) return;

              const current = moduleAccessMap[moduleId];
              if (!current || accessLevelId > current) {
                moduleAccessMap[moduleId] = accessLevelId;
              }
            });

            Object.entries(moduleAccessMap).forEach(
              ([moduleIdStr, accessLevelId]) => {
                const moduleId = Number(moduleIdStr);
                if (!moduleId || !accessLevelId) return;

                const perm: any = {
                  module_id: moduleId,
                  access_level_id: accessLevelId,
                };

                perm.role_name = roleName;
                perm.department_id = department_id;

                permissions.push(perm);
              }
            );
          } catch (err) {
            console.error(
              'Error loading employee permissions for role update fallback:',
              err
            );
          }
        }

        const roleUpdatePayload = {
          role_name: roleName,
          department_id: department_id,
          permissions: permissions,
        };

        const roleRes: any =
          await RoleCreateService.updateRolePermissions(roleUpdatePayload);

        const roleStatus = roleRes?.status ?? roleRes?.statusCode;
        if (roleStatus && roleStatus < HTTP_STATUSES.BAD_REQUEST) {
          toast.success('Role permissions updated successfully');
          navigateTo('/admin/master/employee');
          return;
        }

        throw new Error(
          roleRes?.data?.message || 'Failed to update role permissions'
        );
      } else {
        const permissions: any[] = [];

        Object.entries(accessData).forEach(([_, section]) => {
          Object.values(section.modules).forEach((moduleData: any) => {
            const { moduleId, full, read, write, edit } = moduleData;

            // Determine the highest access level (only create one permission per module)
            let accessLevelId: number | null = null;
            if (full) {
              accessLevelId = 3; // Full Access
            } else if (write || edit) {
              accessLevelId = 2; // Write/Edit
            } else if (read) {
              accessLevelId = 1; // Read
            }

            if (accessLevelId !== null) {
              permissions.push({
                module_id: moduleId,
                access_level_id: accessLevelId,
              });
            }
          });
        });

        const payload = {
          role_name: roleName,
          department_id,
          permissions: permissions,
        };

        const roleRes: any = await RoleCreateService.create(
          payload as any // payload matches CreateRolePayload at runtime
        );

        const roleStatus = roleRes?.status ?? roleRes?.statusCode;
        if (roleStatus && roleStatus < HTTP_STATUSES.BAD_REQUEST) {
          toast.success('Role created successfully');
          navigateTo('/admin/master/employee');
          return;
        }

        throw new Error(roleRes?.data?.message || 'Failed to create role');
      }
    } catch (error: any) {
      console.error('Error saving permissions:', error);
      toast.error(
        error?.message || 'Failed to save permissions. Please try again.'
      );
    }
  };

  const handleCancel = () => {
    navigateTo('/admin/master/employee');
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#fafafa', minHeight: '100vh' }}>
      <PageHeader
        title={
          mode === 'update-permission' ? 'Update Permission' : 'Create Role'
        }
        navigateUrl="/admin/master/employee"
        showCreateBtn={false}
        showlistBtn={true}
        showDownloadBtn={false}
      />

      {employeeProfileData && (
        <ProfileCard
          profileData={employeeProfileData}
          type="employee"
          mode="list"
          showAvatar
        />
      )}

      <Grid container spacing={2} mt={1.2}>
        <Grid
          container
          sx={{
            width: '100%',
            p: 2.5,
            borderRadius: '8px',
            border: `1px solid ${theme.Colors.grayLight}`,
            backgroundColor: theme.Colors.whitePrimary,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* ===== HEADER (Role Details) ===== */}
          <Box
            sx={{
              width: '100%',
              borderBottom: `1px solid ${theme.Colors.grayLight}`,
              pb: 1,
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
              Role Details
            </Typography>
          </Box>

          {/* ===== FORM ROWS ===== */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* LEFT COLUMN */}
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                required
                label="Department"
                options={departmentOptions}
                value={edit.getValue('department')}
                isReadOnly={isDepartmentReadOnly}
                onChange={(_e: any, value: any) => {
                  if (isDepartmentReadOnly) return;
                  edit.update({ department: value });
                }}
                addNewLabel={isDepartmentReadOnly ? undefined : '+ Add New '}
                onAddNew={
                  isDepartmentReadOnly
                    ? undefined
                    : () => setDeptDialogOpen(true)
                }
                // placeholder="Select or add department"
                isOptionEqualToValue={(option: any, value: any) =>
                  option.value === value?.value
                }
              />
            </Grid>

            {/* RIGHT COLUMN */}
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="Role Name"
                value={edit.getValue('role_name')}
                disabled={isViewMode}
                onChange={(e) => edit.update({ role_name: e.target.value })}
                placeholder="Enter role name"
                {...commonTextInputProps}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* ===== MODULE PERMISSIONS ===== */}
      <Box sx={{ mt: 3 }}>
        {sections.map((section, index) => (
          <Box
            key={index}
            sx={{
              mb: 2,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              backgroundColor: theme.Colors.whitePrimary,
              border: `1px solid ${theme.Colors.grayLight}`,
            }}
          >
            {/* Section Header */}
            <Box
              onClick={() => handleToggleSection(section.title)}
              sx={{
                backgroundColor: '#fdf3f3',
                px: 2,
                py: 1.5,
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${theme.Colors.grayLight}`,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#fce8e8',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox
                  size="small"
                  checked={accessData[section.title]?.checked || false}
                  disabled={isViewMode}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSectionCheck(section.title);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  sx={{
                    color: '#7a1c1c',
                    '&.Mui-checked': { color: '#7a1c1c' },
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: '#7a1c1c',
                    fontFamily: theme.fontFamily.roboto,
                    fontSize: '16px',
                  }}
                >
                  {section.title}
                </Typography>
              </Box>
              <ExpandMoreIcon
                sx={{
                  color: '#7a1c1c',
                  transform: isSectionExpanded(section.title)
                    ? 'rotate(180deg)'
                    : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                }}
              />
            </Box>

            {/* Table Content - Conditionally Visible */}
            {isSectionExpanded(section.title) && (
              <Box sx={{ p: 0 }}>
              {/* === Table Header === */}
              <Grid
                container
                sx={{ px: 3, py: 2, borderBottom: '1px solid #e0e0e0' }}
              >
                <Grid size={{ xs: 5 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontFamily: theme.fontFamily.roboto,
                      fontSize: '14px',
                      color: '#000000',
                    }}
                  >
                    Modules
                  </Typography>
                </Grid>
                <Grid size={{ xs: 2.33 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                    }}
                  >
                    <Checkbox
                      size="small"
                      checked={areAllModulesChecked(section.title, 'full')}
                      disabled={isViewMode}
                      onChange={() =>
                        handleHeaderCheckboxChange(section.title, 'full')
                      }
                      sx={{
                        color: '#7a1c1c',
                        '&.Mui-checked': { color: '#7a1c1c' },
                      }}
                    />
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: theme.fontFamily.roboto,
                        fontSize: '14px',
                        color: '#000000',
                      }}
                    >
                      Full Access
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 2.33 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                    }}
                  >
                    <Checkbox
                      size="small"
                      checked={areAllModulesChecked(section.title, 'read')}
                      disabled={isViewMode}
                      onChange={() =>
                        handleHeaderCheckboxChange(section.title, 'read')
                      }
                      sx={{
                        color: '#7a1c1c',
                        '&.Mui-checked': { color: '#7a1c1c' },
                      }}
                    />
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: theme.fontFamily.roboto,
                        fontSize: '14px',
                        color: '#000000',
                      }}
                    >
                      View Only
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 2.33 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                    }}
                  >
                    <Checkbox
                      size="small"
                      checked={areAllModulesChecked(section.title, 'edit')}
                      disabled={isViewMode}
                      onChange={() =>
                        handleHeaderCheckboxChange(section.title, 'edit')
                      }
                      sx={{
                        color: '#7a1c1c',
                        '&.Mui-checked': { color: '#7a1c1c' },
                      }}
                    />
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: theme.fontFamily.roboto,
                        fontSize: '14px',
                        color: '#000000',
                      }}
                    >
                      Edit Only
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* === Module Rows === */}
              {section?.modules?.map((module: any, i: number) => (
                <Grid
                  container
                  key={i}
                  sx={{
                    px: 3,
                    py: 2,
                    borderBottom: '1px solid #f1f1f1',
                    alignItems: 'center',
                    '&:last-child': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  <Grid size={{ xs: 5 }}>
                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontFamily: theme.fontFamily.roboto,
                        fontSize: '14px',
                        color: '#000000',
                      }}
                    >
                      {module.module_name}
                    </Typography>
                  </Grid>

                  {['full', 'read', 'edit'].map((type) => (
                    <Grid
                      size={{ xs: 2.33 }}
                      key={type}
                      display="flex"
                      justifyContent="center"
                    >
                      <Checkbox
                        size="small"
                        checked={
                          accessData[section.title]?.modules?.[
                            module.module_name
                          ]?.[type] || false
                        }
                        disabled={isViewMode}
                        onChange={() =>
                          handleAccessChange(
                            section.title,
                            module.module_name,
                            type
                          )
                        }
                        sx={{
                          color: '#7a1c1c',
                          '&.Mui-checked': { color: '#7a1c1c' },
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* === Footer Buttons === */}
      {!isViewMode && (
        <FormAction
          handleCreate={handleCreate}
          firstBtntxt="Save"
          handleCancel={handleCancel}
        />
      )}

      {/* Add Department Dialog */}
      <Dialog
        open={deptDialogOpen}
        onClose={() => {
          if (!isCreatingDept) {
            setDeptDialogOpen(false);
            setNewDeptName('');
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Add New </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Department Name"
            fullWidth
            value={newDeptName}
            onChange={(e) => setNewDeptName(e.target.value)}
            // placeholder="Enter department name"
            disabled={isCreatingDept}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isCreatingDept) {
                e.preventDefault();
                // You can trigger the save here if needed
              }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 2 }}>
          <FormAction
            btnWidth={110}
            firstBtntxt={isCreatingDept ? 'Saving...' : 'Save'}
            secondBtntx="Cancel"
            disableCreate={isCreatingDept}
            handleCreate={async () => {
              const name = newDeptName.trim();
              if (!name) {
                toast.error('Please enter a department name');
                return;
              }

              const result = await handleCreateDepartment(name);

              if (result.success && result.data) {
                const newDeptOption = {
                  label: result.data.name,
                  value: String(result.data.id),
                };

                // Update dropdown and selection
                setDepartmentOptions((prev) => [newDeptOption, ...prev]);
                edit.update({ department: newDeptOption });

                toast.success(
                  result.message || 'Department added successfully'
                );
                setNewDeptName('');
                setDeptDialogOpen(false);
              } else {
                toast.error(result.message || 'Failed to create department');
              }
            }}
            handleCancel={() => {
              if (!isCreatingDept) {
                setDeptDialogOpen(false);
                setNewDeptName('');
              }
            }}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleAccessPage;
