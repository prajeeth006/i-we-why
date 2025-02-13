using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.ValueSegments;

internal interface IValueSegmentServiceClient : ICachedUserDataServiceClient<ValueSegment> { }

internal class ValueSegmentServiceClient(IGetDataServiceClient getDataServiceClient) : CachedUserDataServiceClient<ValueSegmentResponse, ValueSegment>
    (getDataServiceClient, PosApiEndpoint.Crm.LoyaltyValueSegment), IValueSegmentServiceClient { }
