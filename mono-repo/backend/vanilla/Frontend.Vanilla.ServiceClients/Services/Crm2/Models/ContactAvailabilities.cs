using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Frontend.Vanilla.ServiceClients.Services.Crm2.Models;

internal sealed class ContactAvailabilities
{
    [JsonProperty(NamingStrategyType = typeof(DefaultNamingStrategy))]
    public IReadOnlyList<ContactAvailability> Availabilities { get; set; }
}

internal sealed class ContactAvailability(string name = null, bool isAgentAvailable = false, bool isWithinServiceHours = false)
{
    public string Name { get; } = name;
    public bool IsAgentAvailable { get; } = isAgentAvailable;
    public bool IsWithinServiceHours { get; } = isWithinServiceHours;
}
