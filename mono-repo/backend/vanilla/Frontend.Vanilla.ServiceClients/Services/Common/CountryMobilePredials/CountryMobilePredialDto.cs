using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Common.CountryMobilePredials;

internal sealed class CountryMobilePredialDto
{
    public string CountryPredial { get; set; }
    public List<OperatorDto> Operators { get; set; }
}

internal class OperatorDto
{
    public string Code { get; set; }
}

internal class CountryMobilePredialsResponse : IPosApiResponse<IReadOnlyList<CountryMobilePredial>>
{
    public List<CountryMobilePredialDto> Countries { get; set; }

    public IReadOnlyList<CountryMobilePredial> GetData() => Countries
        .ConvertAll(p => new CountryMobilePredial(p.CountryPredial, p.Operators.ConvertAll(o => o.Code)))
        .AsReadOnly();
}
