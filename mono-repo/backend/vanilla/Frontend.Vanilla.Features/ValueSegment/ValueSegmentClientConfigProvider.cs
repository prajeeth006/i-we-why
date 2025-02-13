using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.ServiceClients.Services.Crm;

namespace Frontend.Vanilla.Features.ValueSegment;

internal sealed class ValueSegmentClientConfigProvider(IPosApiCrmServiceInternal posApiCrmService) : LambdaClientConfigProvider("vnValueSegment",
    async cancellationToken =>
    {
        var valueSegment = await posApiCrmService.GetValueSegmentAsync(cancellationToken);

        return new
        {
            customerId = valueSegment.CustomerId,
            segmentId = valueSegment.SegmentId,
            lifeCycleStage = valueSegment.LifeCycleStage,
            eWarningVip = valueSegment.Ewvip,
            microSegmentId = valueSegment.MicroSegmentId,
            churnRate = valueSegment.ChurnRate,
            futureValue = valueSegment.FutureValue,
            potentialVip = valueSegment.PotentialVip,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
