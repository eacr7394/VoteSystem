using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace Common;

public static class ExcelGeneratorVoteRequestQuorumNewOwner
{
    public async static Task<byte[]> GenerateExcelFile(QuorumResultsVoteRequestQuorumNewOwner data)
    {
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial; // Actualiza según tu licencia

        using (ExcelPackage package = new())
        {
            ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("Quorum");

            worksheet.Cells["A1:D1"].Merge = true;
            worksheet.Cells["A1:D1"].Style.Font.Size = 14;
            worksheet.Cells["A1:D1"].Style.Font.Bold = true;
            worksheet.Cells["A1:D1"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            worksheet.Cells["A1"].Value = "Asamblea de Propietarios del Ph Monte Bello";

            // Fila vacía
            worksheet.Cells["A2:E2"].Merge = true;

            // Fecha de la Asamblea
            worksheet.Cells["A3"].Value = "Fecha de la Asamblea";
            worksheet.Cells["B3:D3"].Merge = true;
            worksheet.Cells["B3:D3"].Value = data.MeetingDate;

            // Quorum Reglamentario
            worksheet.Cells["A4"].Value = "Quorum Reglamentario";
            worksheet.Cells["B4:D4"].Merge = true;
            worksheet.Cells["B4:D4"].Value = data.QuorumRequirement;

            // Quorum de Excepción (Ley 284, Art. 67)
            worksheet.Cells["A5"].Value = "Quorum de Excepción (Ley 284, Art. 67)";
            worksheet.Cells["B5:D5"].Merge = true;
            worksheet.Cells["B5:D5"].Value = data.ExceptionQuorum;

            // # de Propietarios Asistentes
            worksheet.Cells["A6"].Value = "# de Propietarios Asistentes";
            worksheet.Cells["B6:D6"].Merge = true;
            worksheet.Cells["B6:D6"].Value = data.ActualAttendance;


            // Espacio en blanco
            worksheet.Cells["A7:D7"].Merge = true;
            worksheet.Cells["A8:D8"].Merge = true;

            // Detalle de votos
            worksheet.Cells["A9"].Value = "# de Casa";
            worksheet.Cells["B9"].Value = "Fecha de Asamblea";
            worksheet.Cells["C9"].Value = "Fecha y Hora de Llegada";

            worksheet.Cells["A9:D9"].Style.Font.Size = 12;
            worksheet.Cells["A9:D9"].Style.Font.Bold = true;
            worksheet.Cells["A9:D9"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;


            // Agregar datos de votación
            int row = 10;
            foreach (var quorum in data.Results)
            {
                worksheet.Cells[$"A{row}"].Value = quorum.Number;
                worksheet.Cells[$"B{row}"].Value = quorum.MeetingDate;
                worksheet.Cells[$"C{row}"].Value = quorum.QuorumDate;
                row++;
            }

            using (var allCells = worksheet.Cells[worksheet.Dimension.Address])
            {
                var border = allCells.Style.Border;
                border.Top.Style = ExcelBorderStyle.Thin;
                border.Left.Style = ExcelBorderStyle.Thin;
                border.Right.Style = ExcelBorderStyle.Thin;
                border.Bottom.Style = ExcelBorderStyle.Thin;
                allCells.AutoFitColumns();
            }


            // Guardar el archivo Excel
            return await package.GetAsByteArrayAsync();
        }
    }

}

public class QuorumResultVoteRequestQuorumNewOwner
{
    public string Number { get; set; } = null!;
    public string MeetingDate { get; set; } = null!;
    public string QuorumDate { get; set; } = null!;
}

public class QuorumResultsVoteRequestQuorumNewOwner
{
    public string MeetingDate { get; set; } = null!;
    public int QuorumRequirement { get; set; }
    public int ExceptionQuorum { get; set; }
    public int ActualAttendance { get; set; }

    public List<QuorumResultVoteRequestQuorumNewOwner> Results { get; set; } = null!;

}
