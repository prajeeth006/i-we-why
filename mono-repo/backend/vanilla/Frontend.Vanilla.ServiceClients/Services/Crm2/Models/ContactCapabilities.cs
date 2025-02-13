using System.Collections.Generic;
using JetBrains.Annotations;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Frontend.Vanilla.ServiceClients.Services.Crm2.Models;

internal sealed class ContactCapabilities
{
    [JsonProperty(NamingStrategyType = typeof(DefaultNamingStrategy))]
    public IReadOnlyList<ContactCapability> Capabilities { get; set; }
}

internal sealed class ContactCapability(string name = null, bool isAvailable = false, string message = null)
{
    [CanBeNull]
    public string Name { get; set; } = name;

    public bool IsAvailable { get; set; } = isAvailable;

    [CanBeNull]
    public string Message { get; set; } = message;
}
