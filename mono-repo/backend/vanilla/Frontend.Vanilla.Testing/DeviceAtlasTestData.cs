using System.IO;
using System.Text;

namespace Frontend.Vanilla.Testing;

internal static class DeviceAtlasTestData
{
    public static readonly string Data = ReadData("Frontend.Vanilla.Testing.Data.DeviceRecognitionData_Integration.txt");

    private static string ReadData(string path)
    {
        using var stream = typeof(DeviceAtlasTestData).Assembly.GetManifestResourceStream(path);
        using var reader = new StreamReader(stream, Encoding.UTF8);

        return reader.ReadToEnd();
    }
}
