export async function exportElementToPdf(elementId, fileName) {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error("Layout de impressão não encontrado.");
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    scrollX: 0,
    scrollY: 0,
  });

  const image = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imageProps = pdf.getImageProperties(image);
  const ratio = Math.min(pageWidth / imageProps.width, pageHeight / imageProps.height);
  const imageWidth = imageProps.width * ratio;
  const imageHeight = imageProps.height * ratio;
  const x = (pageWidth - imageWidth) / 2;
  const y = (pageHeight - imageHeight) / 2;

  pdf.addImage(image, "PNG", x, y, imageWidth, imageHeight);
  pdf.save(fileName);
}
