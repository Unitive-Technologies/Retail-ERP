import {
  commonTextInputProps,
  formLayoutWithHeaderStyle,
} from '@components/CommonStyles';
import {
  AutoSearchSelectWithLabel,
  Loader,
  styles,
  TextInput,
} from '@components/index';
import PageHeader from '@components/PageHeader';
import { useEdit } from '@hooks/useEdit';
import Grid from '@mui/material/Grid2';
import FormSectionHeader from '@pages/admin/common/FormSectionHeader';
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import WebsiteSection from './WebsiteSection';
import SelectTypeSection from './SelectTypeSection';
import ProductDescriptionSection from './ProductDescriptionSection';
import ProductImageSection from './ProductImageSection';
import PurchaseDetailsSection from './PurchaseDetailsSection';
import ProductInfoSection from './ProductInfoSection';
import QRCodeSection from './QRCodeSection';
import SummaryDetailsSection from './SummaryDetailsSection';
import VarientDetailsSection from './VarientDetailsSection';
import ItemDetailsSection from './ItemDetailsSection';
import {
  getDefaultVariationsState,
  normalizeProductVariations,
} from './utils/variationUtils';
import {
  HTTP_STATUSES,
  PRODUCT_TYPE,
  VARIATION_TYPE,
  MeasurementType,
} from '@constants/Constance';
import FormAction from '@components/ProjectCommon/FormAction';
import { ProductService } from '@services/ProductService';
import { DropDownServiceAll } from '@services/DropDownServiceAll';
import ProductAddOnSection from './ProductAddOnSection';
import { API_SERVICES } from '@services/index';
import { useDebounce } from '@hooks/useDebounce';

const normalizeVisibilityValue = (value: any, defaultValue = true) => {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === 'string') {
    return value.toLowerCase() !== 'hide';
  }
  return Boolean(value);
};

const ProductForm = () => {
  const navigateTo = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location?.search);
  const paramRowId = Number(params.get('rowId'));
  const type = params.get('type');
  const [isAddOn, setIsAddOn] = useState<boolean>(false);
  const [addOn, setAddOn] = useState<any[]>([]);
  const [isError, setIsError] = useState(false);
  const [itemFieldErrors, setItemFieldErrors] = useState<
    Record<string, boolean>
  >({});
  const [dropdownData, setDropdownData] = useState<any>({
    vendors: [],
    grns: [],
    materialTypes: [],
    categories: [],
    subcategories: [],
    branches: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [refcode, setRefcode] = useState('');
  const [refNoOptions, setRefNoOptions] = useState<any[]>([]);
  const [refNoRecords, setRefNoRecords] = useState<any[]>([]);
  const [selectedPurchaseRecord, setSelectedPurchaseRecord] = useState<
    any | null
  >(null);
  const [variantDetails, setVariantDetails] = useState([]);
  const debouncedRefCodeSearch = useDebounce(refcode, 500);
  const memoizedAddOn = useMemo(() => addOn, [addOn]);
  const memoizedvariantDetails = useMemo(
    () => variantDetails,
    [variantDetails]
  );

  const getTitle = () => {
    switch (type) {
      case 'create':
        return 'CREATE PRODUCT';
      case 'edit':
        return 'EDIT PRODUCT';
      case 'view':
        return 'VIEW PRODUCT';
      default:
        return 'PRODUCT PRODUCT';
    }
  };

  const itemDetailsInitialValues: any = {
    valueType: 'INITIAL',
    sku_id: '',
    gross_weight: '',
    net_weight: '',
    actual_stone_weight: '',
    stone_weight: '',
    stone_value: '',
    stone_visibility: true,
    quantity: '',
    measurement_details: [
      {
        label_name: '',
        value: '',
        measurement_type: '',
      },
    ],
    height: '',
    // for weight
    making_charge_type: 'Percentage',
    making_charge: '',
    wastage_type: 'Percentage',
    wastage: '',
    website_price_type: 'Amount',
    website_price: '',
    // for piece
    rate_per_gram: '',
    base_price: '',
    tag_url: '',
    additional_details: [],
    variation: '',
  };

  const InitialValues: any = {
    vendor_id: '',
    grn_id: '',
    ref_no_id: '',
    material_type_id: '',
    category_id: '',
    subcategory_id: '',
    branch_id: '',
    product_name: '',
    description: '',
    is_published: true,
    image_urls: [],
    sku_id: '',
    purity: '',
    hsn_code: '',
    product_type: PRODUCT_TYPE.WEIGHT,
    variation_type: VARIATION_TYPE.WITHOUT,
    item_details: [itemDetailsInitialValues],
    variations: getDefaultVariationsState(),
  };

  const edit = useEdit(InitialValues);
  const shouldSkipResetRef = useRef(false);

  const mapRefOptions = (records: any[] = []) =>
    records.map((info: any) => ({
      label: info.ref_no,
      value: info.id,
    }));

  const handleRefNoChange = (_event: any, value: any) => {
    edit.update({ ref_no_id: value });

    if (!value?.value) {
      setSelectedPurchaseRecord(null);
      return;
    }

    const selectedRecord =
      refNoRecords.find((record: any) => record.id === value.value) || null;

    setSelectedPurchaseRecord(selectedRecord);
  };

  const handleGrnChange = (_event: any, value: any) => {
    edit.update({ grn_id: value, ref_no_id: '' });
    setSelectedPurchaseRecord(null);

    if (!value?.value) {
      setRefNoRecords([]);
      setRefNoOptions([]);
      return;
    }

    const records = value.grn_info_ids || [];
    setRefNoRecords(records);
    const refOptions = mapRefOptions(records);
    setRefNoOptions(refOptions);
  };

  const hasError = (specificError: boolean) => isError && specificError;

  const fieldErrors = {
    vendor_id: !edit.getValue('vendor_id')?.value,
    grn_id: !edit.getValue('grn_id')?.value,
    ref_no_id: !edit.getValue('ref_no_id')?.value,
    material_type_id: !edit.getValue('material_type_id')?.value,
    category_id: !edit.getValue('category_id')?.value,
    subcategory_id: !edit.getValue('subcategory_id')?.value,
    product_name: !edit.allFilled('product_name'),
    description: !edit.allFilled('description'),
    sku_id: !edit.allFilled('sku_id'),
    purity: !edit.allFilled('purity'),
    hsn_code: !edit.allFilled('hsn_code'),
    branch_id: !edit.getValue('branch_id')?.value,
  };

  const validateProductFields = () => {
    const itemDetails = edit.getValue('item_details') || [];
    const variations = edit.getValue('variations');
    const errors: Record<string, boolean> = {};
    let allValid = true;
    let incompleteAdditionalFound = false;

    const cleanedItemDetails = itemDetails.map((item: any, index: number) => {
      const productType = edit.getValue('product_type');

      if (!item.gross_weight) {
        errors[`item_details_${index}_gross_weight`] = true;
        allValid = false;
      }
      if (!item.net_weight) {
        errors[`item_details_${index}_net_weight`] = true;
        allValid = false;
      }
      // if (!item.stone_weight) {
      //   errors[`item_details_${index}_stone_weight`] = true;
      //   allValid = false;
      // }
      if (!item.quantity) {
        errors[`item_details_${index}_quantity`] = true;
        allValid = false;
      }

      if (productType === PRODUCT_TYPE.WEIGHT) {
        if (!item.making_charge) {
          errors[`item_details_${index}_making_charge`] = true;
          allValid = false;
        }
        if (!item.wastage) {
          errors[`item_details_${index}_wastage`] = true;
          allValid = false;
        }
      }

      if (productType === PRODUCT_TYPE.PIECE) {
        if (!item.rate_per_gram) {
          errors[`item_details_${index}_rate_per_gram`] = true;
          allValid = false;
        }
        if (!item.base_price) {
          errors[`item_details_${index}_base_price`] = true;
          allValid = false;
        }
      }

      // Validate measurement_details
      const measurementDetails = (item.measurement_details || []).map(
        (md: any) => ({
          label_name: md.label_name || '',
          value: md.value || '',
          // measurement_type: md.measurement_type?.value || '',
        })
      );
      measurementDetails.forEach((md: any) => {
        const hasAnyValue = md.label_name || md.value;
        const allFilled = md.label_name && md.value;

        if (hasAnyValue && !allFilled) {
          toast.error(
            'Please fill all fields in Measurement Details or remove the incomplete ones.'
          );
          allValid = false;
        }
      });

      const additionalDetails = (item.additional_details || []).map(
        (ad: any) => ({
          label_name: ad.label_name || '',
          actual_weight: ad.actual_weight || ad.unit || '',
          weight: ad.weight || ad.unit || ad.actual_weight || '',
          value: ad.value || ad.price || '',
          is_visible: normalizeVisibilityValue(
            ad?.is_visible ?? ad?.visibility,
            true
          ),
        })
      );
      const validAdditional = additionalDetails.filter((ad: any) => {
        const hasAnyValue =
          ad.label_name || ad.actual_weight || ad.weight || ad.value;
        const allFilled =
          ad.label_name && ad.actual_weight && ad.weight && ad.value;

        if (hasAnyValue && !allFilled) {
          incompleteAdditionalFound = true;
        }

        return hasAnyValue;
      });

      return {
        ...item,
        stone_visibility: normalizeVisibilityValue(
          item?.stone_visibility,
          true
        ),
        // measurement_details: validMeasurements,
        additional_details: validAdditional,
      };
    });

    if (incompleteAdditionalFound) {
      toast.error(
        'Please fill all fields in Additional Details or remove the incomplete ones.'
      );
      allValid = false;
    }

    const normalizedVariations = normalizeProductVariations(variations);

    edit.update({
      item_details: cleanedItemDetails,
      variations: normalizedVariations,
    });

    setItemFieldErrors(errors);
    return !Object.values(errors).some(Boolean) && allValid;
  };

  const validateVariantDetails = (
    variantDetails: any[]
  ): { isValid: boolean; validVarientRows: any[] } => {
    if (!variantDetails || variantDetails.length === 0) {
      return { isValid: true, validVarientRows: [] };
    }

    const invalidIndexes: number[] = [];
    const validRows: any[] = [];

    variantDetails.forEach((v, index) => {
      const hasType = !!v.varient_type?.value;
      const hasValues =
        Array.isArray(v.varient_value) && v.varient_value.length > 0;

      if (!hasType && !hasValues) {
        return;
      }

      if (hasType && hasValues) {
        validRows.push(v);
        return;
      }
      invalidIndexes.push(index + 1);
    });

    if (invalidIndexes.length > 0) {
      toast.error(
        `Please fill all fields in varient details or remove Variant Row${
          invalidIndexes.length > 1 ? 's' : ''
        }: ${invalidIndexes.join(', ')}`
      );
      return { isValid: false, validVarientRows: [] };
    }

    return { isValid: true, validVarientRows: validRows };
  };

  const validateMainProductFields = () => {
    const fieldErrors = {
      vendor_id: !edit.getValue('vendor_id')?.value,
      grn_id: !edit.getValue('grn_id')?.value,
      ref_no_id: !edit.getValue('ref_no_id')?.value,
      material_type_id: !edit.getValue('material_type_id')?.value,
      category_id: !edit.getValue('category_id')?.value,
      subcategory_id: !edit.getValue('subcategory_id')?.value,
      product_name: !edit.allFilled('product_name'),
      description: !edit.allFilled('description'),
      sku_id: !edit.allFilled('sku_id'),
      purity: !edit.allFilled('purity'),
      hsn_code: !edit.allFilled('hsn_code'),
    };

    const hasErrors = Object.values(fieldErrors).some(Boolean);

    if (hasErrors) {
      toast.error('Please fill all required product fields.');
    }

    setItemFieldErrors((prev: any) => ({
      ...prev,
      ...fieldErrors,
    }));

    return !hasErrors;
  };

  const handleCreate = async () => {
    console.log(edit.getValue('item_details'), 'itemDetails----------');
    const images = edit.getValue('image_urls') || [];

    if (!images.length) {
      toast.error('Please upload at least one product image');
      return;
    }

    // const remainingQuantityRaw = Number(edit.getValue('remaining_quantity'));
    // const isRemainingQuantityZero = Number.isFinite(remainingQuantityRaw)
    //   ? Math.abs(remainingQuantityRaw) < 0.0001
    //   : false;

    // if (!isRemainingQuantityZero) {
    //   toast.error('Remaining GRN quantity must be zero.');
    //   return;
    // }

    if (edit.getValue('variation_type') === VARIATION_TYPE.WITH) {
      if (!edit.getValue('item_details')?.length) {
        toast.error('Please create atleast one variation items');
        return;
      }
    }

    const { isValid, validVarientRows } =
      validateVariantDetails(variantDetails);

    if (!isValid) return;

    const isMainValid = validateMainProductFields();
    const isValidProduct = validateProductFields();
    if (!isMainValid || !isValidProduct) {
      setIsError(true);
      toast.error('Please fill all required fields correctly');
      return;
    }

    const itemDetails = (edit.getValue('item_details') || []).map(
      (item: any) => ({
        ...item,
        stone_visibility: normalizeVisibilityValue(
          item?.stone_visibility,
          true
        ),
        gross_weight: Number(item.gross_weight || 0),
        net_weight: Number(item.net_weight || 0),
        actual_stone_weight: Number(item.actual_stone_weight || 0),
        stone_weight: Number(item.stone_weight || 0),
        stone_value: Number(item.stone_value || 0),
        quantity: Number(item.quantity || 0),
        making_charge: Number(item.making_charge || 0),
        wastage: Number(item.wastage || 0),
        website_price_type: item.website_price_type || 'Amount',
        website_price: Number(item.website_price || 0),
        rate_per_gram: Number(item.rate_per_gram || 0),
        base_price: Number(item.base_price || 0),
        measurement_details: (item.measurement_details || []).map(
          (detail: any) => ({
            label_name: detail.label_name || '',
            value: detail.value || '',
            measurement_type: detail.measurement_type?.value || '',
          })
        ),
        height: Number(item.height || 0),
        variation: JSON.stringify(item.variation || {}),
        additional_details: (item.additional_details || []).map(
          (detail: any) => ({
            label_name: detail.label_name || '',
            actual_weight: Number(detail.actual_weight || 0),
            weight: Number(
              detail.weight !== undefined && detail.weight !== ''
                ? detail.weight
                : detail.actual_weight || 0
            ),
            value: Number(detail.value || 0),
            is_visible: normalizeVisibilityValue(
              detail?.is_visible ?? detail?.visibility,
              true
            ),
          })
        ),
      })
    );

    const body: any = {
      vendor_id: edit.getValue('vendor_id')?.value || 1,
      grn_id: edit.getValue('grn_id')?.value || 1,
      material_type_id: edit.getValue('material_type_id')?.value || 1,
      category_id: edit.getValue('category_id')?.value || 1,
      subcategory_id: edit.getValue('subcategory_id')?.value || 2,
      ref_no_id: edit.getValue('ref_no_id')?.value || null,
      branch_id: edit.getValue('branch_id')?.value || 2,
      ref_prod_code: edit.getValue('ref_prod_code'),
      product_name: edit.getValue('product_name'),
      description: edit.getValue('description'),
      is_published: edit.getValue('is_published'),
      image_urls: images,
      sku_id: edit.getValue('sku_id'),
      purity: edit.getValue('purity'),
      hsn_code: edit.getValue('hsn_code'),
      product_type: edit.getValue('product_type'),
      variation_type: edit.getValue('variation_type'),
      item_details: itemDetails,
      product_variations: JSON.stringify(
        edit.getValue('variations') || getDefaultVariationsState()
      ),
      varient_details: edit.getValue('varient_details') || [],
      is_addOn: isAddOn,
    };

    try {
      console.log(body, 'body---------');
      if (type === 'edit' && paramRowId) {
        const response: any = await ProductService.UpdateProduct({
          id: paramRowId,
          data: body,
          successMessage: 'Product updated successfully!',
          failureMessage: 'Failed to update product',
        });

        if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
          const updatedProductId = paramRowId;

          if (addOn.length > 0 && updatedProductId) {
            const addonBody = {
              product_id: updatedProductId,
              addon_product_ids: addOn.map((a) => a.id),
            };

            await ProductService.createAddons(addonBody);
          }

          if (validVarientRows?.length > 0 && updatedProductId) {
            const variantPayload = {
              items: validVarientRows.map((v: any) => ({
                product_id: updatedProductId,
                variant_id: v.varient_type.value,
                variant_type_ids: v.varient_value,
              })),
            };

            await ProductService.createProductVariants(variantPayload);
          }
          navigateTo('/admin/master/products');
        }
      } else {
        const response: any = await ProductService.create({
          data: body,
          successMessage: 'Product created successfully!',
          failureMessage: 'Failed to create product',
        });

        if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
          const createdProductId = response?.data?.data?.product?.id;

          if (addOn.length > 0 && createdProductId) {
            const addonBody = {
              product_id: createdProductId,
              addon_product_ids: addOn.map((a) => a.id),
            };

            await ProductService.createAddons(addonBody);
          }

          if (validVarientRows?.length > 0 && createdProductId) {
            const variantPayload = {
              items: validVarientRows.map((v: any) => ({
                product_id: createdProductId,
                variant_id: v.varient_type.value,
                variant_type_ids: v.varient_value,
              })),
            };

            await ProductService.createProductVariants(variantPayload);
          }
          edit.update({
            product_name: '',
            description: '',
            image_urls: [],
            sku_id: '',
            item_details: [itemDetailsInitialValues],
          });
          setVariantDetails([]);
          setAddOn([]);
          setIsAddOn(false);
          const selectedCategory = edit.getValue('category_id');
          console.log(selectedCategory, 'selectedCategory------');
          await generateProductSku(
            selectedCategory?.short_name,
            selectedCategory,
            true
          );
          // navigateTo('/admin/master/products');
        }
      }
    } catch (err) {
      console.error('Error creating product:', err);
      toast.error('Something went wrong while creating product');
    }
  };

  const handleCancel = () => {
    navigateTo('/admin/master/products');
  };

  const handleErrorUpdate = (fieldKey: any) => {
    setItemFieldErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[fieldKey];
      return newErrors;
    });
  };

  const loadGrnDropdown = async (vendorOption?: any) => {
    const vendorId =
      vendorOption && typeof vendorOption === 'object'
        ? vendorOption?.value
        : vendorOption;

    if (!vendorId) {
      setDropdownData((prev: any) => ({
        ...prev,
        grns: [],
      }));
      return [];
    }

    try {
      const res: any = await DropDownServiceAll.getGrns({
        vendor_id: vendorId,
      });
      const grns =
        (res?.data?.data?.grns || []).map((item: any) => ({
          label: item?.grn_no,
          value: item?.id,
          grn_info_ids: item?.grn_info_ids || [],
        })) || [];

      setDropdownData((prev: any) => ({
        ...prev,
        grns,
      }));
      return grns;
    } catch (error) {
      console.error('Error fetching GRNs', error);
      toast.error('Failed to load GRNs for the selected vendor');
      setDropdownData((prev: any) => ({
        ...prev,
        grns: [],
      }));
      return [];
    }
  };

  const handleVendorChange = async (_event: any, value: any) => {
    edit.update({ vendor_id: value, grn_id: '', ref_no_id: '' });
    setSelectedPurchaseRecord(null);
    setRefNoRecords([]);
    setRefNoOptions([]);
    await loadGrnDropdown(value);
  };

  useEffect(() => {
    if (shouldSkipResetRef.current) {
      return;
    }

    const isWithout =
      edit.getValue('variation_type') === VARIATION_TYPE.WITHOUT;

    setTimeout(() => {
      edit.update({
        item_details: isWithout ? [itemDetailsInitialValues] : [],
        variations: getDefaultVariationsState(),
      });

      if (isError) {
        validateProductFields();
      }
    }, 0);
  }, [
    edit.getValue('product_type'),
    edit.getValue('variation_type'),
    edit.getValue('ref_no_id')?.value,
    edit.getValue('material_type_id')?.value,
  ]);

  useEffect(() => {
    if (shouldSkipResetRef.current) {
      const timer = setTimeout(() => {
        shouldSkipResetRef.current = false;
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [edit.edits]);

  const fetchDropdowns = async () => {
    try {
      const materialTypeId = edit.getValue('material_type_id')?.value;
      const categoryId = edit.getValue('category_id')?.value;

      const [
        materialTypesRes,
        vendorsRes,
        categoriesRes,
        subcategoriesRes,
        branchesRes,
      ]: any = await Promise.all([
        DropDownServiceAll.getMaterialTypes(),
        DropDownServiceAll.getVendors(),
        DropDownServiceAll.getCategories(
          materialTypeId ? { material_type_id: materialTypeId } : undefined
        ),
        DropDownServiceAll.getSubcategories(
          categoryId ? { category_id: categoryId } : undefined
        ),
        DropDownServiceAll.getBranches(),
      ]);

      const mapToOption = (arr: any[], labelKey: string, valueKey: string) =>
        arr?.map((item) => ({
          label: item[labelKey],
          value: item[valueKey],
        })) || [];

      const materialTypeRecords =
        materialTypesRes?.data?.data?.materialTypes || [];

      const materialTypes =
        materialTypeRecords.map((item: any) => ({
          label: item.material_type,
          value: item.id,
          material_price:
            item.material_price ?? item.material_price_per_g ?? '',
        })) || [];

      const data = {
        materialTypes,
        vendors: mapToOption(
          vendorsRes?.data?.data?.vendors || [],
          'vendor_name',
          'id'
        ),
        subcategories: mapToOption(
          subcategoriesRes?.data?.data?.subcategories || [],
          'subcategory_name',
          'id'
        ),
        categories: (categoriesRes?.data?.data?.categories || []).map(
          (item: any) => ({
            label: item.category_name,
            value: item.id,
            short_name: item.short_name || '',
          })
        ),
        branches:
          branchesRes?.data?.data?.branches?.map((item: any) => ({
            label: item.branch_name,
            value: item.id,
            branch_no: item.branch_no,
          })) || [],
        grns: [],
      };

      setDropdownData(data);
      // setRefNoRecords([]);
      // setRefNoOptions([]);
      if (!paramRowId || type === 'create') {
        setSelectedPurchaseRecord(null);
      }

      if (type !== 'create' && paramRowId) {
        await fetchProductById(paramRowId, data);
      }
    } catch (err) {
      console.error('Error fetching dropdowns', err);
    }
  };

  const fetchProductById = async (id: number, dropdowns = dropdownData) => {
    try {
      const response: any = await ProductService.getById(id);

      if (response?.data?.statusCode === HTTP_STATUSES.OK) {
        const productData = response.data.data;
        const product = productData?.product;
        const productDetails = productData?.item_details;
        const addOnIds = productData?.addon_products?.map(
          (i: any) => i?.addon_product_id
        );
        const varientDetails = productData?.variant_details;

        // Parse stringified fields safely
        const parsedItemDetails = (productDetails || []).map((item: any) => {
          const variationObj = item.variation ? JSON.parse(item.variation) : {};
          const combination = Object.values(variationObj).join(' / ');

          const measurementDetails = (item.measurement_details || []).map(
            (detail: any) => {
              const measurementTypeValue = detail.measurement_type || '';
              const measurementTypeOption = MeasurementType.find(
                (type) => type.value === measurementTypeValue
              ) || { label: measurementTypeValue, value: measurementTypeValue };

              return {
                ...detail,
                measurement_type: measurementTypeOption,
              };
            }
          );

          return {
            ...item,
            variation: variationObj,
            combination,
            measurement_details: measurementDetails,
          };
        });

        const parsedProductVariations = normalizeProductVariations(
          product.product_variations
            ? JSON.parse(product.product_variations)
            : null
        );

        const normalizedVariantDetails = (varientDetails || []).map(
          (v: any, index: number) => ({
            id: v.variant_id ?? index + 1,
            varient_type: {
              label: v.variant_type,
              value: v.variant_id,
            },
            varient_value: v.values?.map((val: any) => val.id) || [],
          })
        );
        const productGrnInfoId = product?.ref_no_id;
        const vendorOption = findOption(dropdowns.vendors, product.vendor_id);
        const grnOptions = await loadGrnDropdown(vendorOption);
        const grnOption = findOption(grnOptions, product.grn_id);
        let grnRefRecords = (grnOption && grnOption.grn_info_ids) || [];
        if (
          (!grnRefRecords || !grnRefRecords.length) &&
          product?.product_grn_info
        ) {
          grnRefRecords = [product?.product_grn_info];
        }
        const grnRefOptions = mapRefOptions(grnRefRecords);

        setRefNoRecords(grnRefRecords);
        setRefNoOptions(grnRefOptions);

        const refNoOption = productGrnInfoId
          ? findOption(grnRefOptions, productGrnInfoId)
          : '';

        const mappedData = {
          vendor_id: vendorOption,
          grn_id: grnOption,
          material_type_id: findOption(
            dropdowns.materialTypes,
            product.material_type_id
          ),
          category_id: findOption(dropdowns.categories, product.category_id),
          subcategory_id: findOption(
            dropdowns.subcategories,
            product.subcategory_id
          ),
          branch_id: findOption(dropdowns.branches, product.branch_id),
          ref_prod_code: product.ref_prod_code,
          product_name: product.product_name,
          description: product.description,
          is_published: product.is_published,
          image_urls: product.image_urls || [],
          sku_id: product.sku_id,
          purity: product.purity,
          hsn_code: product.hsn_code,
          product_type: product.product_type,
          variation_type: product.variation_type,
          item_details: parsedItemDetails,
          variations: parsedProductVariations,
          ref_no_id: refNoOption,
        };

        if (productGrnInfoId) {
          const grnInfoRecord =
            product?.product_grn_info ||
            grnRefRecords.find((info: any) => info.id == productGrnInfoId);
          if (grnInfoRecord) {
            setSelectedPurchaseRecord(grnInfoRecord);
          } else {
            setSelectedPurchaseRecord(null);
          }
        } else {
          setSelectedPurchaseRecord(null);
        }
        shouldSkipResetRef.current = true;
        edit.update(mappedData);
        setAddOn(addOnIds);
        setIsAddOn(product?.is_addOn);
        setVariantDetails(normalizedVariantDetails);
      }
    } catch (err) {
      console.error('Error fetching product by ID:', err);
      toast.error('Failed to fetch product details');
    }
  };

  const findOption = (options: any[], id: number | string) => {
    if (!id) return '';
    return options.find((opt) => opt.value == id) || '';
  };

  const handleMaterialTypeChange = async (_event: any, value: any) => {
    edit.update({
      material_type_id: value,
      category_id: '',
      subcategory_id: '',
    });

    if (value?.value) {
      const res: any = await DropDownServiceAll.getCategories({
        material_type_id: value.value,
      });
      const categories =
        res?.data?.data?.categories?.map((item: any) => ({
          label: item.category_name,
          value: item.id,
          short_name: item.short_name || '',
        })) || [];

      setDropdownData((prev: any) => ({
        ...prev,
        categories,
        subcategories: [],
      }));
    }
  };

  const handleCategoryChange = async (_event: any, value: any) => {
    edit.update({
      category_id: value,
      subcategory_id: '',
    });

    if (value?.value) {
      const res: any = await DropDownServiceAll.getSubcategories({
        category_id: value.value,
      });
      const subcategories =
        res?.data?.data?.subcategories?.map((item: any) => ({
          label: item.subcategory_name,
          value: item.id,
        })) || [];

      setDropdownData((prev: any) => ({
        ...prev,
        subcategories,
      }));

      // Generate SKU with category short_name as prefix
      if (value?.short_name) {
        await generateProductSku(value.short_name, value);
      }
    }
  };

  const generateProductSku = async (
    prefix?: string,
    categoryValue?: any,
    isCreate = false
  ) => {
    if (type !== 'create') return;

    if (!prefix) {
      return;
    }

    try {
      const params = { prefix: prefix };
      const response: any = await ProductService.generateSku(params);

      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        if (isCreate) {
          edit.update({
            product_name: '',
            description: '',
            image_urls: [],
            item_details: [itemDetailsInitialValues],
            category_id: categoryValue || edit.getValue('category_id'),
            sku_id: response?.data?.data,
          });
        } else {
          edit.update({
            category_id: categoryValue || edit.getValue('category_id'),
            sku_id: response?.data?.data,
          });
        }
      } else {
        toast.error('SKU ID not generated');
      }
    } catch (error) {
      toast.error('Error generating SKU ID');
      handleCancel();
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        await fetchDropdowns();
      } catch (error) {
        console.error('Initialization failed:', error);
        toast.error('Failed to load product data');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const fetchRefPro = async () => {
      if (!debouncedRefCodeSearch) return;

      const params = { sku_id: debouncedRefCodeSearch };
      const res: any = await API_SERVICES.ProductService.searchAddons(params);

      if (res?.data?.statusCode === HTTP_STATUSES.OK) {
        const products = res?.data?.data?.products ?? [];
        if (products?.length === 1) {
          const product = products[0];
          edit.update({
            product_name: product?.product_name,
            description: product?.description,
            image_urls: product?.image_urls,
          });
        } else {
          edit.update({
            product_name: '',
            description: '',
            image_urls: [],
          });
        }
      }
    };

    fetchRefPro();
  }, [debouncedRefCodeSearch]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Grid
      container
      flexDirection={'column'}
      sx={{
        overflowX: 'hidden',
        '@media (max-width:1000px)': {
          width: '950px',
          overflowX: 'auto',
        },
      }}
    >
      <PageHeader
        title={getTitle()}
        navigateUrl="/admin/master/products"
        showCreateBtn={false}
        showlistBtn={true}
        showDownloadBtn={false}
        titleStyle={{ color: '#000000' }}
      />
      <Grid
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Grid container mt={2} flexDirection={'column'}>
          <FormSectionHeader title="Vendor Details" />
          <Grid container sx={formLayoutWithHeaderStyle}>
            <Grid size={{ xs: 6, md: 6 }} sx={{ ...styles.leftItem, pb: 3.5 }}>
              <AutoSearchSelectWithLabel
                required
                label="Vendor"
                options={dropdownData?.vendors}
                value={edit.getValue('vendor_id')}
                onChange={handleVendorChange}
                isError={hasError(fieldErrors.vendor_id)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 6 }} sx={styles.rightItem}>
              <AutoSearchSelectWithLabel
                required
                label="GRN NO"
                options={dropdownData?.grns}
                value={edit.getValue('grn_id')}
                onChange={handleGrnChange}
                isError={hasError(fieldErrors.grn_id)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 6 }} sx={{ ...styles.leftItem }}>
              <AutoSearchSelectWithLabel
                required
                label="Ref No"
                options={refNoOptions}
                value={edit.getValue('ref_no_id')}
                onChange={handleRefNoChange}
                isError={hasError(fieldErrors.ref_no_id)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 6 }} sx={styles.rightItem}>
              <AutoSearchSelectWithLabel
                required
                label="Material Type"
                options={dropdownData.materialTypes}
                value={edit.getValue('material_type_id')}
                onChange={handleMaterialTypeChange}
                isError={hasError(fieldErrors.material_type_id)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 6 }} sx={{ ...styles.leftItem }}>
              <AutoSearchSelectWithLabel
                required
                label="Category"
                options={dropdownData.categories}
                value={edit.getValue('category_id')}
                onChange={handleCategoryChange}
                isReadOnly={!edit.getValue('material_type_id')}
                isError={hasError(fieldErrors.category_id)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 6 }} mt={'8px'} sx={styles.rightItem}>
              <AutoSearchSelectWithLabel
                required
                label="Sub Category"
                options={dropdownData.subcategories}
                value={edit.getValue('subcategory_id')}
                onChange={(_, value) => edit.update({ subcategory_id: value })}
                isReadOnly={!edit.getValue('category_id')}
                isError={hasError(fieldErrors.subcategory_id)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 6 }} sx={{ ...styles.leftItem }}>
              <AutoSearchSelectWithLabel
                required
                label="Branch"
                options={dropdownData.branches}
                value={edit.getValue('branch_id')}
                onChange={(_event, value) => {
                  edit.update({ branch_id: value });
                }}
                isError={hasError(fieldErrors.branch_id)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 6 }} sx={{ ...styles.rightItem, pb: 3.5 }}>
              <TextInput
                inputLabel="Ref Product Code"
                value={refcode}
                onChange={(e: any) => setRefcode(e.target.value)}
                {...commonTextInputProps}
                required={false}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid gap={1.5} pb={15} container>
          <Grid container size={7.35} gap={1.5} mt={2} flexDirection={'column'}>
            <ProductDescriptionSection
              edit={edit}
              fieldErrors={fieldErrors}
              hasError={hasError}
            />
            <SelectTypeSection edit={edit} />
            <ItemDetailsSection
              edit={edit}
              fieldErrors={itemFieldErrors}
              handleErrorUpdate={handleErrorUpdate}
              purchaseRecord={selectedPurchaseRecord}
            />
            <VarientDetailsSection
              variantDetails={memoizedvariantDetails}
              setVariantDetails={setVariantDetails}
            />
            <ProductAddOnSection
              isAddOn={isAddOn}
              setIsAddOn={setIsAddOn}
              addOn={memoizedAddOn}
              setAddOn={setAddOn}
              type={type}
            />
          </Grid>

          <Grid
            container
            size={'grow'}
            gap={1.5}
            mt={2}
            flexDirection={'column'}
          >
            <WebsiteSection edit={edit} />
            <ProductImageSection edit={edit} />
            <PurchaseDetailsSection purchaseRecord={selectedPurchaseRecord} />
            <ProductInfoSection
              edit={edit}
              fieldErrors={fieldErrors}
              hasError={hasError}
            />
            <QRCodeSection edit={edit} product_id={paramRowId} />
            <SummaryDetailsSection
              edit={edit}
              purchaseRecord={selectedPurchaseRecord}
            />
          </Grid>
        </Grid>
        {type === 'view' ? (
          <Grid
            sx={{
              background: 'transparent',
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          />
        ) : null}
      </Grid>
      {type !== 'view' ? (
        <FormAction
          btnWidth={type == 'create' ? 131 : 181}
          firstBtntxt={type == 'create' ? 'Add Product' : 'Update Product'}
          handleCreate={handleCreate}
          handleCancel={handleCancel}
        />
      ) : null}
    </Grid>
  );
};

export default ProductForm;
