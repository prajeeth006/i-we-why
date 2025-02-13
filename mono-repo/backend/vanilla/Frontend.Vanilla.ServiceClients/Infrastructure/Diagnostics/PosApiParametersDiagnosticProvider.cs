using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure.Execution;
using Frontend.Vanilla.ServiceClients.Services.Common;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Diagnostics;

internal sealed class PosApiParametersDiagnosticProvider(IPosApiRestRequestFactory requestFactory, IPosApiCommonService commonService) : IDiagnosticInfoProvider
{
    public DiagnosticInfoMetadata Metadata { get; } = new DiagnosticInfoMetadata(
        name: "PosAPI Parameters",
        urlPath: "posapi-parameters",
        shortDescription: "Displays parameters posted to PosAPI and how they get applied.");

    public async Task<object> GetDiagnosticInfoAsync(CancellationToken cancellationToken)
    {
        var restRequest = requestFactory.CreateRestRequest(new PosApiRestRequest(new PathRelativeUri("Demo.svc/Test")));
        var clientInfo = await commonService.GetClientInformationAsync(cancellationToken);

        return new
        {
            SentFromVanilla = new
            {
                SampleUrl = restRequest.Url,
                restRequest.Headers,
                restRequest.Timeout,
            },
            AppliedOnPosApiSide = clientInfo,
        };
    }
}
