package certificate

import (
	"bytes"
	"fmt"
	"time"

	"github.com/jung-kurt/gofpdf"
)

type CertificateData struct {
    ID           string
    StudentName  string
    CourseName   string
    AverageScore float64
    IssuedAt     time.Time
}

func GeneratePDF(data CertificateData) ([]byte, error) {
    pdf := gofpdf.New("L", "mm", "A4", "")
    pdf.AddPage()

    // Background border
    pdf.SetDrawColor(139, 90, 43)
    pdf.SetLineWidth(3)
    pdf.Rect(10, 10, 277, 190, "D")
    pdf.SetLineWidth(1)
    pdf.Rect(14, 14, 269, 182, "D")

    // Header — nama platform
    pdf.SetFont("Arial", "B", 36)
    pdf.SetTextColor(139, 90, 43)
    pdf.SetY(30)
    pdf.CellFormat(297, 15, "Schomora", "", 1, "C", false, 0, "")

    // Subtitle
    pdf.SetFont("Arial", "I", 14)
    pdf.SetTextColor(100, 100, 100)
    pdf.CellFormat(297, 8, "Adaptive Learning Platform", "", 1, "C", false, 0, "")

    // Divider
    pdf.SetDrawColor(139, 90, 43)
    pdf.SetLineWidth(0.5)
    pdf.Line(60, 58, 237, 58)

    // Certificate of Completion
    pdf.SetFont("Arial", "", 16)
    pdf.SetTextColor(80, 80, 80)
    pdf.SetY(65)
    pdf.CellFormat(297, 10, "Certificate of Completion", "", 1, "C", false, 0, "")

    // "This is to certify that"
    pdf.SetFont("Arial", "", 12)
    pdf.SetTextColor(100, 100, 100)
    pdf.SetY(80)
    pdf.CellFormat(297, 8, "This is to certify that", "", 1, "C", false, 0, "")

    // Nama student
    pdf.SetFont("Arial", "B", 28)
    pdf.SetTextColor(30, 30, 30)
    pdf.SetY(90)
    pdf.CellFormat(297, 14, data.StudentName, "", 1, "C", false, 0, "")

    // "has successfully completed"
    pdf.SetFont("Arial", "", 12)
    pdf.SetTextColor(100, 100, 100)
    pdf.SetY(108)
    pdf.CellFormat(297, 8, "has successfully completed the course", "", 1, "C", false, 0, "")

    // Nama kursus
    pdf.SetFont("Arial", "BI", 20)
    pdf.SetTextColor(139, 90, 43)
    pdf.SetY(118)
    pdf.CellFormat(297, 12, data.CourseName, "", 1, "C", false, 0, "")

    // Skor rata-rata
    pdf.SetFont("Arial", "", 11)
    pdf.SetTextColor(100, 100, 100)
    pdf.SetY(133)
    pdf.CellFormat(297, 8, fmt.Sprintf("with an average score of %.0f%%", data.AverageScore), "", 1, "C", false, 0, "")

    // Divider
    pdf.Line(60, 146, 237, 146)

    // Tanggal & ID
    pdf.SetFont("Arial", "", 10)
    pdf.SetTextColor(130, 130, 130)
    pdf.SetY(150)
    pdf.CellFormat(297, 6, fmt.Sprintf("Issued on %s", data.IssuedAt.Format("January 02, 2006")), "", 1, "C", false, 0, "")
    pdf.SetY(157)
    pdf.CellFormat(297, 6, fmt.Sprintf("Certificate ID: %s", data.ID), "", 1, "C", false, 0, "")

    // Verification URL
    pdf.SetFont("Arial", "I", 9)
    pdf.SetTextColor(150, 150, 150)
    pdf.SetY(165)
    pdf.CellFormat(297, 6, fmt.Sprintf("Verify at: schomora.com/verify/%s", data.ID), "", 1, "C", false, 0, "")

    // Export ke bytes
    var buf bytes.Buffer
    if err := pdf.Output(&buf); err != nil {
        return nil, err
    }

    return buf.Bytes(), nil
}