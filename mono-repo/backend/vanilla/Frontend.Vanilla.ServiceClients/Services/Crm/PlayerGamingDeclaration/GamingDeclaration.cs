using System;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.PlayerGamingDeclaration;

internal sealed class GamingDeclaration(string status, DateTime? acceptedDate) : IPosApiResponse<GamingDeclaration>
{
    public string Status { get; } = status;
    public DateTime? AcceptedDate { get; } = acceptedDate;

    public GamingDeclaration GetData() => this;
}

/// <summary>
/// Gaming declaration request.
/// </summary>
public sealed class GamingDeclarationRequest
{
    /// <summary>
    /// Gaming declaration request.
    /// </summary>
    /// <param name="status"></param>
    public GamingDeclarationRequest(string status)
    {
        Status = status;
    }

    /// <summary>
    /// Status of the user.
    /// </summary>
    public string Status { get; set; }
}
