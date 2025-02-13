using System.Collections.Generic;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Common.Countries;

internal sealed class CountryDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string ThreeLetterCode { get; set; }
    public string DefaultTimezone { get; set; }
    public string DefaultCurrency { get; set; }
    public string Predial { get; set; }
    public string ZipFormat { get; set; }
    public ZipFormat ZipFormatValidation { get; set; }
}

internal sealed class CountriesResponse : IPosApiResponse<IReadOnlyList<Country>>
{
    public CountryDto[] Countries { get; set; }

    public IReadOnlyList<Country> GetData() => Countries
        .ConvertAll(c =>
            new Country(c.Id, c.Name, c.ThreeLetterCode, c.DefaultTimezone, c.DefaultCurrency, c.Predial, c.ZipFormatValidation ?? ZipFormatParser.Parse(c.ZipFormat)))
        .AsReadOnly();
}
