using System.Collections.Generic;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Common.HistoricalCountries;

public sealed class HistoricalCountry(string id = null, string code = null, string name = null, UtcDateTime created = default, UtcDateTime disbanded = default)
{
    public string Id { get; } = id;
    public string Code { get; } = code;
    public string Name { get; } = name;
    public UtcDateTime Created { get; } = created;
    public UtcDateTime Disbanded { get; } = disbanded;
}

internal sealed class HistoricalCountryResponse : IPosApiResponse<IReadOnlyList<HistoricalCountry>>
{
    public HistoricalCountry[] HistoricalCountries { get; set; }
    public IReadOnlyList<HistoricalCountry> GetData() => HistoricalCountries.AsReadOnly();
}
