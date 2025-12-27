import Excel from "exceljs";
import { saveAs } from "file-saver";

export const handleExcelDownload = async ({
    columns = [],
    pdfData = [],
    fileName = "ENHR",
    address = "",
  }: {
    columns: any[];
    pdfData?: any[];
    fileName?: string;
    address?: string;
  }) => {
    const workbook = new Excel.Workbook();
    try {
      const worksheet = workbook.addWorksheet(fileName);
      if (address) {
        // Insert the address row
        const addressRow = worksheet.insertRow(1, [address]);
        addressRow.font = { bold: true }; 
        addressRow.alignment = { horizontal: "center" };
        worksheet.mergeCells(1, 1, 1, columns.length); 
  
        // Manually add column headers at row 3
        const headers = columns.map((col) => col.header); 
        const headerRow = worksheet.insertRow(3, headers); // Insert headers at row 3
        headerRow.font = { bold: true }; 
        headerRow.alignment = { horizontal: "center" };
  
        // Set column widths and alignments
        columns.forEach((column, index) => {
          worksheet.getColumn(index + 1).width = column.width || 15; // Set custom or default width
          worksheet.getColumn(index + 1).alignment = { horizontal: "center" };
        });
  
        // Add data rows starting from row 4
        pdfData.forEach((singleData) => {
          const rowData = columns.map((col) => singleData[col.key]); // Map data to match column keys
          worksheet.addRow(rowData); // Add the row
        });
      } else {
        worksheet.columns = columns;
        worksheet.getRow(1).font = { bold: true };
        worksheet.columns.forEach((column) => {
          column.width = columns.length + 5;
          column.alignment = { horizontal: "center" };
        });
        pdfData.forEach((singleData: any) => {
          worksheet.addRow(singleData);
        });
      }
      // Generate buffer and save
      const buf = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buf]), `${fileName}.xlsx`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Something Went Wrong", error.message);
      } else {
        console.error("Something Went Wrong", "An unknown error occurred.");
      }
    }
  };