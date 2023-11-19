namespace RestFullApi.Commons;

public static class StringExtension
{
    private readonly static Random RANDOM = new Random();

    public static string RandomString(int length)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return new string(Enumerable.Repeat(chars, length)
            .Select(s => s[RANDOM.Next(s.Length)]).ToArray());
    }

    private static byte[] CalculateSHA256Hash(string input)
    {
        using (SHA256 sha256 = SHA256.Create())
        {
            byte[] inputBytes = Encoding.UTF8.GetBytes(input);
            return sha256.ComputeHash(inputBytes);
        }
    }

    public static string GetSHA256Hash(string input)
    {
        byte[] bytes = CalculateSHA256Hash(input);
        StringBuilder hex = new(bytes.Length * 2);
        foreach (byte b in bytes)
        {
            hex.AppendFormat("{0:x2}", b);
        }
        return hex.ToString();
    }
}