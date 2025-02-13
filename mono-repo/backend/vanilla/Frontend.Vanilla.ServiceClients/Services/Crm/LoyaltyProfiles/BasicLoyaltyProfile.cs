using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using JetBrains.Annotations;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;

public class BasicLoyaltyProfile(string category = null, decimal points = 0, bool isOptInEnabled = false) : IPosApiResponse<BasicLoyaltyProfile>
{
    [CanBeNull]
    public string Category { get; } = category;

    public decimal Points { get; } = points;
    public bool IsOptInEnabled { get; } = isOptInEnabled;

    BasicLoyaltyProfile IPosApiResponse<BasicLoyaltyProfile>.GetData() => this;
}
