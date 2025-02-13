using System;
using System.Collections.Generic;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication;

/// <summary>
/// ClaimsResponse.
/// </summary>
public class ClaimsResponse
{
    /// <summary>
    /// ClaimValues.
    /// </summary>
    public Dictionary<string, string> ClaimValues { get; } = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
}
