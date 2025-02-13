using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Common.CountryMobilePredials;

public sealed class CountryMobilePredial(string countryPredial = null, IEnumerable<string> operatorCodes = null)
{
    public string CountryPredial { get; } = countryPredial;
    public IReadOnlyList<string> OperatorCodes { get; } = operatorCodes.NullToEmpty().ToArray().AsReadOnly();
}
