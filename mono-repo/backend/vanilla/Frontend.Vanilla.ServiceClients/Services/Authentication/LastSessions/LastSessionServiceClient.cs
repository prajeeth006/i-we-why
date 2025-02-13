using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.LastSessions;

internal interface ILastSessionServiceClient : ICachedUserDataServiceClient<LastSession> { }

internal class LastSessionServiceClient(IGetDataServiceClient getDataServiceClient) : CachedUserDataServiceClient<LastSessionDto, LastSession>
    (getDataServiceClient, PosApiEndpoint.Authentication.LastSession, cacheKey: "LastSession"), ILastSessionServiceClient { }
