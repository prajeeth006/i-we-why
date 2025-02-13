#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Common.Countries;

public sealed class Country(
    string id = null,
    string name = null,
    string threeLetterCode = null,
    string defaultTimezone = null,
    string defaultCurrency = null,
    string predial = null,
    ZipFormat zipFormat = null)
{
    public string Id { get; } = id;
    public string Name { get; } = name;
    public string ThreeLetterCode { get; } = threeLetterCode;
    public string DefaultTimezone { get; } = defaultTimezone;
    public string DefaultCurrency { get; } = defaultCurrency;
    public string Predial { get; } = predial;
    public ZipFormat ZipFormat { get; } = zipFormat;
}
