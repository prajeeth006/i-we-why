using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Common.ApplicationInfo;

internal sealed class ApplicationInformation(string name = null, decimal allRating = 0) : IPosApiResponse<ApplicationInformation>
{
    public string Name { get; } = name;
    public decimal AllRating { get; } = allRating;

    ApplicationInformation IPosApiResponse<ApplicationInformation>.GetData() => this;
}
