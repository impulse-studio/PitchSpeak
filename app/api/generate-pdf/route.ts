import jsPDF from "jspdf";
import { type NextRequest, NextResponse } from "next/server";

interface GeneratePDFRequest {
  projectSummary: string;
  estimation: {
    timeframe: string;
    complexity: string;
    cost?: string;
    features: string[];
  };
  fullSummary: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GeneratePDFRequest = await request.json();

    // Create a new PDF document
    const doc = new jsPDF();

    // Set up fonts and colors
    const primaryColor = [41, 128, 185] as [number, number, number]; // Blue
    const textColor = [44, 62, 80] as [number, number, number]; // Dark gray
    const margin = 20;
    let yPosition = margin;

    // Title
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.text("Project Estimation Report", margin, yPosition);
    yPosition += 15;

    // Date
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      margin,
      yPosition
    );
    yPosition += 15;

    // Project Summary Section
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.text("Project Overview", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    const summaryLines = doc.splitTextToSize(body.projectSummary, 170);
    doc.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 7 + 10;

    // Estimation Section
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.text("Estimation Details", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setTextColor(...textColor);

    // Complexity
    doc.setFont("helvetica", "bold");
    doc.text("Complexity:", margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(body.estimation.complexity, margin + 30, yPosition);
    yPosition += 8;

    // Timeframe
    doc.setFont("helvetica", "bold");
    doc.text("Timeframe:", margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(body.estimation.timeframe, margin + 30, yPosition);
    yPosition += 8;

    // Cost (if provided)
    if (body.estimation.cost) {
      doc.setFont("helvetica", "bold");
      doc.text("Estimated Cost:", margin, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(body.estimation.cost, margin + 40, yPosition);
      yPosition += 8;
    }

    yPosition += 5;

    // Features
    doc.setFont("helvetica", "bold");
    doc.text("Key Features:", margin, yPosition);
    yPosition += 8;

    doc.setFont("helvetica", "normal");
    body.estimation.features.forEach((feature, index) => {
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = margin;
      }

      const featureLines = doc.splitTextToSize(`${index + 1}. ${feature}`, 165);
      doc.text(featureLines, margin + 5, yPosition);
      yPosition += featureLines.length * 7 + 2;
    });

    yPosition += 10;

    // Full Summary Section
    if (yPosition > 240) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.text("Detailed Summary", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    const fullSummaryLines = doc.splitTextToSize(body.fullSummary, 170);

    // Split across pages if needed
    fullSummaryLines.forEach((line: string) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += 7;
    });

    // Generate PDF as buffer
    const pdfBuffer = doc.output("arraybuffer");

    // Return the PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="project-estimation-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
