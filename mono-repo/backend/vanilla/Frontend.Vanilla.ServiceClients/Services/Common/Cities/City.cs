using System;
using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Common.Cities;
#pragma warning disable CS1591 // Just dummy data -> no docs needed
public sealed class City(string id = null, string code = null, string name = null)
{
    public string Id { get; } = id;
    public string Code { get; } = code;
    public string Name { get; } = name;
}

internal sealed class CitiesResponse : IPosApiResponse<IReadOnlyList<City>>
{
    public City[] Cities { get; set; } = Array.Empty<City>();

    public IReadOnlyList<City> GetData() => Cities.AsReadOnly();
}
