using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;

#pragma warning disable 1591
namespace Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Filters;

public class BeforeLoginContext(ExecutionMode mode, PosApiRestRequest request)
{
    public ExecutionMode Mode { get; } = mode;
    public PosApiRestRequest Request { get; set; } = request;
}

public sealed class AfterLoginContext(ExecutionMode mode, PosApiRestRequest request, LoginResponse response) : BeforeLoginContext(mode, request)
{
    public LoginResponse Response { get; set; } = response;
}
