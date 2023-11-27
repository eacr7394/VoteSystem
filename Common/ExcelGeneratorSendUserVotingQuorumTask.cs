using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace Common;

public static class ExcelGeneratorSendUserVotingQuorumTask
{
    public async static Task<byte[]> GenerateExcelFile(VotingResultsSendUserVotingQuorumTask data)
    {
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial; // Actualiza según tu licencia

        using (ExcelPackage package = new())
        {
            ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("ResultadosVotacion");

            worksheet.Cells["A1:E1"].Merge = true;
            worksheet.Cells["A1:E1"].Style.Font.Size = 14;
            worksheet.Cells["A1:E1"].Style.Font.Bold = true;
            worksheet.Cells["A1:E1"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            worksheet.Cells["A1"].Value = "Asamblea de Propietarios del Ph Monte Bello";

            // Fila vacía
            worksheet.Cells["A2:E2"].Merge = true;

            // Descripción de la Votación
            worksheet.Cells["A3"].Value = "Descripción de la Votación";
            worksheet.Cells["B3:E3"].Merge = true;
            worksheet.Cells["B3:E3"].Value = data.VoteDescription;

            // Fecha de la Asamblea
            worksheet.Cells["A4"].Value = "Fecha de la Asamblea";
            worksheet.Cells["B4:E4"].Merge = true;
            worksheet.Cells["B4:E4"].Value = data.MeetingDate;

            // Votos a Favor
            worksheet.Cells["A5"].Value = "Votos a Favor";
            worksheet.Cells["B5:E5"].Merge = true;
            worksheet.Cells["B5:E5"].Value = data.VotesInFavor;

            // Votos en Contra
            worksheet.Cells["A6"].Value = "Votos en Contra";
            worksheet.Cells["B6:E6"].Merge = true;
            worksheet.Cells["B6:E6"].Value = data.VotesAgainst;

            // Abstenciones
            worksheet.Cells["A7"].Value = "Abstenciones";
            worksheet.Cells["B7:E7"].Merge = true;
            worksheet.Cells["B7:E7"].Value = data.Abstentions;

            // Quórum
            worksheet.Cells["A8"].Value = "Quórum Reglamentario 51%";
            worksheet.Cells["A8:B8"].Merge = true;
            worksheet.Cells["A9:B9"].Merge = true;
            worksheet.Cells["A9"].Value = data.QuorumRequirement > data.ActualAttendance ? "No se cumplió" : $"{data.ActualAttendance}";
            worksheet.Cells["C8"].Value = "Quórum de Excepción 20% (Artículo 67 de la Ley 284)";
            worksheet.Cells["C8:E8"].Merge = true;
            worksheet.Cells["C9:E9"].Merge = true;
            worksheet.Cells["C9"].Value = data.QuorumRequirement > data.ActualAttendance ? ((data.ExceptionQuorum < data.ActualAttendance) ? "No se cumplió" : $"{data.ActualAttendance}") : "No aplica";

            worksheet.Cells["A8:E8"].Style.Font.Size = 12;
            worksheet.Cells["A8:E8"].Style.Font.Bold = true;


            // Espacio en blanco
            worksheet.Cells["A10:E10"].Merge = true;
            worksheet.Cells["A11:E11"].Merge = true;

            // Detalle de votos
            worksheet.Cells["A12"].Value = "# de Casa";
            worksheet.Cells["B12"].Value = "Votó en Contra";
            worksheet.Cells["C12"].Value = "Votó a Favor";
            worksheet.Cells["D12"].Value = "Se Abstuvo";
            worksheet.Cells["E12"].Value = "Fecha y Hora de Emisión del Voto";

            worksheet.Cells["A12:E12"].Style.Font.Size = 12;
            worksheet.Cells["A12:E12"].Style.Font.Bold = true;
            worksheet.Cells["A12:E12"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;


            // Agregar datos de votación
            int row = 13;
            foreach (var voto in data.Results)
            {
                worksheet.Cells[$"A{row}"].Value = voto.Number;
                worksheet.Cells[$"B{row}"].Value = voto.VotedAgainst;
                worksheet.Cells[$"C{row}"].Value = voto.VotedInFavor;
                worksheet.Cells[$"D{row}"].Value = voto.Abstained;
                worksheet.Cells[$"E{row}"].Value = voto.VoteDate;
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

public class VotingResultSendUserVotingQuorumTask
{
    public int? Number { get; set; } = null!;
    public string VotedAgainst { get; set; } = null!;
    public string VotedInFavor { get; set; } = null!;
    public string Abstained { get; set; } = null!;
    public DateTime? VoteDate { get; set; } = null!;
}

public class VotingResultsSendUserVotingQuorumTask
{
    public string VoteDescription { get; set; } = null!;
    public DateOnly? MeetingDate { get; set; } = null!;
    public int? VotesInFavor { get; set; }
    public int? VotesAgainst { get; set; }
    public int? Abstentions { get; set; }
    public int? QuorumRequirement { get; set; }
    public int? ExceptionQuorum { get; set; }
    public int? ActualAttendance { get; set; }

    public List<VotingResultSendUserVotingQuorumTask> Results { get; set; } = null!;

}
