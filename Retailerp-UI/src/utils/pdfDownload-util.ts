import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

type pdfDownloadProps = {
  pdfData?: any[];
  pdfHeaders?: any[];
  fileName?: string;
  address?: any;
  imageUrl?: any;
  columnMapping?: any;
  hiddenCols?: any;
};

export const handlePdfClick = ({
    pdfData,
    pdfHeaders,
    fileName = "",
    address = "",
    hiddenCols = [],
    columnMapping,
  }: pdfDownloadProps) => {
    if (!pdfData?.length) {
      return;
    }
  
    let formattedData = [...pdfData];
    let formattedHeaders = pdfHeaders?.length ? [...pdfHeaders] : [];
  
    if (hiddenCols.length > 0) {
      // Filter pdfData based on hiddenCols
      formattedData = pdfData.map((row: any) => {
        const filteredRow: any = {};
        Object.keys(row).forEach((key) => {
          const columnName = Object.entries(columnMapping).find(
            ([, value]) => value === key
          )?.[0];
          if (!hiddenCols.includes(columnName!)) {
            filteredRow[key] = row[key];
          }
        });
        return filteredRow;
      });
  
      // Filter pdfHeaders based on hiddenCols
      formattedHeaders = (pdfHeaders || []).filter((header) =>
        Object.entries(columnMapping).some(
          ([columnName, dataKey]) =>
            dataKey === header.key && !hiddenCols.includes(columnName)
        )
      );
    }
  
    const pdfDoc = new jsPDF();
    const pageWidth = pdfDoc.internal.pageSize.getWidth(); // Get the width of the page
    const pdfHeader = formattedHeaders?.length
      ? formattedHeaders?.map((item) => {
          return { header: item.header, dataKey: item.key };
        })
      : [];
  
    // Add address
    let addressY = 20; // Start Y-coordinate for address
  
    if (address) {
      const addressLines = address.split("\n"); // Split address into lines
      // Add address text
      addressLines.forEach((line: string | string[]) => {
        pdfDoc.text(line, pageWidth / 2, addressY, { align: "center" }); // Center-align each line
        addressY += 5;
      });
  
      // Add the table below the address
      pdfDoc.text(fileName, 10, addressY + 10);
      autoTable(pdfDoc, {
        body: formattedData,
        columns: pdfHeader,
        styles: {
          cellWidth: "auto",
          cellPadding: 4,
          fontSize: 8,
        },
        headStyles: {
          fillColor: "#BB4E65",
          fontSize: 8,
        },
        margin: { top: addressY + 15, left: 10, right: 10, bottom: 10 }, // Adjust top margin based on address height
        tableWidth: "auto",
        startY: addressY + 15, // Start table below the address
        pageBreak: "auto",
      });
    } else {
      // Title
      pdfDoc.text(fileName, 10, 10);
      autoTable(pdfDoc, {
        body: formattedData,
        columns: pdfHeader,
        styles: {
          cellWidth: "auto", // Adjust the cell width to fit content
          cellPadding: 4,
          fontSize: 8, // Adjust font size to fit more content on one page
        },
        headStyles: {
          fillColor: "#BB4E65",
          fontSize: 8,
        },
        // columnStyles: {
        //   0: { cellWidth: 5 }, // First column width
        // },
        margin: { top: 40, left: 10, right: 10, bottom: 10 }, // Adjust the top margin to avoid empty space
        tableWidth: "auto", // Ensure the table width wraps within the page width
        startY: 15, // Ensure the table starts below the text
        pageBreak: "auto", // Automatically handle page breaks
      });
    }
  
    return pdfDoc.save(`${fileName}.pdf`);
  };
  
  export async function exportScrollablePageToPdf() {
    const doc = new jsPDF("p", "px");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const padding = 10; 
  
    // Select the scrollable container
    const scrollableContainer = document.querySelector(
      ".custom-chart"
    ) as HTMLElement;
  
    if (!scrollableContainer) {
      console.error("Scrollable container not found!");
      return;
    }
  
    // Clone the scrollable container for full content rendering
    const clone = scrollableContainer.cloneNode(true) as HTMLElement;
    clone.style.overflow = "visible";
    clone.style.height = "auto";
    clone.style.position = "absolute";
    clone.style.width = "100%";
    clone.style.left = "0"; // Keep it visible for rendering
    clone.style.top = "0";
    clone.style.zIndex = "-1"; // Push it behind other elements
    document.body.appendChild(clone);
  
    try {
      // Ensure the cloned element is fully rendered before capturing
      await new Promise((resolve) => setTimeout(resolve, 500));
  
      // Convert the entire content to an image
      const imgData = await htmlToImage.toPng(clone);
  
      // Cleanup the cloned element
      document.body.removeChild(clone);
  
      // Calculate the image's aspect ratio
      const imgOriginalWidth = scrollableContainer.offsetWidth;
      const imgOriginalHeight = scrollableContainer.scrollHeight;
  
      const scaleRatio = Math.min(
        (pageWidth - 2 * padding) / imgOriginalWidth,
        (pageHeight - 2 * padding) / imgOriginalHeight
      );
  
      const imgScaledWidth = imgOriginalWidth * scaleRatio;
      const imgScaledHeight = imgOriginalHeight * scaleRatio;
  
      let yOffset = 0;
  
      while (yOffset < imgOriginalHeight) {
        const visibleHeight = Math.min(
          imgScaledHeight - yOffset,
          pageHeight - 2 * padding
        );
  
        const cropHeight = visibleHeight / scaleRatio;
  
        // Add the image to the PDF, center-aligned
        doc.addImage(
          imgData,
          "PNG",
          (pageWidth - imgScaledWidth) / 3, // Center horizontally
          padding,
          imgScaledWidth,
          visibleHeight
        );
  
        yOffset += cropHeight;
  
        if (yOffset < imgOriginalHeight) {
          doc.addPage(); // Add a new page if there's more content
        }
      }
  
      // Save the PDF
      doc.save("dashboard.pdf");
    } catch (err) {
      console.error("Error generating PDF:", err);
      document.body.removeChild(clone);
    }
  }