using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Common.Timezones;

public sealed class Timezone(string id = null, string name = null, int minutesToGmt = default)
{
    public string Id { get; } = id;
    public string Name { get; } = name;
    public int MinutesToGMT { get; } = minutesToGmt;
}

internal sealed class TimezoneResponse : IPosApiResponse<IReadOnlyList<Timezone>>
{
    public Timezone[] Timezones { get; set; }
    public IReadOnlyList<Timezone> GetData() => Timezones.AsReadOnly();
}
