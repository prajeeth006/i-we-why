using System;
using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Common.CountryAreas;

public sealed class CountryArea(string id = null, string countryId = null, string name = null, string fiscalResidence = null)
{
    public string Id { get; } = id;
    public string CountryId { get; } = countryId;
    public string Name { get; } = name;
    public string FiscalResidence { get; } = fiscalResidence;
}

internal sealed class CountryAreaResponse : IPosApiResponse<IReadOnlyList<CountryArea>>
{
    public CountryArea[] CountryAreas { get; set; } = Array.Empty<CountryArea>();
    public IReadOnlyList<CountryArea> GetData() => CountryAreas.AsReadOnly();
}
