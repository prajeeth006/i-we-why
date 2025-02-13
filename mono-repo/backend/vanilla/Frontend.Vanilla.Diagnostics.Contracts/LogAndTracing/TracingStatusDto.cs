namespace Frontend.Vanilla.Diagnostics.Contracts.LogAndTracing;

public sealed class TracingStatusDto(string correlationId, string? recordingExpiration, string kibanaUrl)
{
    public string CorrelationId { get; } = correlationId;
    public string? RecordingExpiration { get; } = recordingExpiration;
    public string KibanaUrl { get; } = kibanaUrl;
}
