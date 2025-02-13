#nullable enable

using System.Collections.Generic;
using System.Globalization;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Common.Currencies;

public sealed class Currency(string? id = null, string? name = null)
{
    public string? Id { get; } = id;
    public string? Name { get; } = name;

    /// <summary>
    /// Formats money amount according to given currency and current culture.
    /// </summary>
    public string FormatMoney(decimal value)
    {
        var culture = CultureInfo.CurrentCulture;

        return value
                   .ToString("C", culture)
                   .RemoveAll(culture.NumberFormat.CurrencySymbol)
                   .Trim()
               + " " + Id;
    }
}

internal sealed class CurrenciesResponse : IPosApiResponse<IReadOnlyList<Currency>>
{
    public Currency[]? Currencies { get; set; }
    public IReadOnlyList<Currency> GetData() => (Currencies?.AsReadOnly()).NullToEmpty();
}
