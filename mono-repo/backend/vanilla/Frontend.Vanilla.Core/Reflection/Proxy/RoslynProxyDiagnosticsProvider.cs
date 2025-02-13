using Frontend.Vanilla.Core.Diagnostics;

namespace Frontend.Vanilla.Core.Reflection.Proxy;

internal sealed class RoslynProxyDiagnosticsProvider : SyncDiagnosticInfoProvider
{
    public override DiagnosticInfoMetadata Metadata { get; } = new DiagnosticInfoMetadata(
        name: "Roslyn Proxy",
        urlPath: "roslyn-proxy",
        shortDescription: "Shows details about Roslyn Proxy compilations.");

    public override object GetDiagnosticInfo()
        => new { Compilations = RoslynProxy.Queue.GetCompilations() };
}
