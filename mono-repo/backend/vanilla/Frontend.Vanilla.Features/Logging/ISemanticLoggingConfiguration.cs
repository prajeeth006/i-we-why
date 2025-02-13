using System.Collections.Generic;

namespace Frontend.Vanilla.Features.Logging;

internal static class SemanticLoggingMessageTemplate
{
    public const string Health = "Health check {Name} failed with {Error}";
}

internal static class SemanticLoggingFileSinkType
{
    public const string App = "app";
    public const string Health = "health";
}

internal interface ISemanticLoggingConfiguration
{
    IReadOnlyCollection<SemanticLoggingFileSink> FileSinks { get; }
    string SerializeToString();
}

internal class SemanticLoggingFileSink
{
    public bool Enabled { get; set; }
    public string Type { get; set; } = "";
    public string Path { get; set; } = "";
    public bool RollOnFileSizeLimit { get; set; }
    public long FileSizeLimitBytes { get; set; }
    public int RetainedFileCountLimit { get; set; }
    public int BufferSize { get; set; }
    public bool Shared { get; set; }
}
