using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Retail.TerminalSession;

internal interface ITerminalSessionServiceClient : ICachedUserDataServiceClient<TerminalSessionDto> { }

internal class TerminalSessionServiceClient(IGetDataServiceClient getDataServiceClient) : CachedUserDataServiceClient<TerminalSessionDto, TerminalSessionDto>
    (getDataServiceClient, PosApiEndpoint.Retail.TerminalSession, cacheKey: "TerminalSession"), ITerminalSessionServiceClient { }
