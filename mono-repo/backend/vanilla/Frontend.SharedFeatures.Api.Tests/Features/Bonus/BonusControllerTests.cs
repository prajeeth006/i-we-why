using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.Bonus;
using Frontend.Vanilla.ServiceClients.Services.Crm2;
using Frontend.Vanilla.ServiceClients.Services.Crm2.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.Bonus;

public class BonusControllerTests
{
    private readonly BonusController target;
    private readonly Mock<ICrmService> crmService;
    private CancellationToken ct;

    public BonusControllerTests()
    {
        crmService = new Mock<ICrmService>();

        target = new BonusController(crmService.Object);
        ct = new CancellationTokenSource().Token;
    }

    [Fact]
    public async Task ShouldUpdateBonusTncAcceptance()
    {
        var bonusTncAcceptance = new BonusTncAcceptance
        {
            IsCampaignBonus = true,
            OfferArc = 1,
            OfferId = 325,
            TncAcceptanceFlag = true,
        };

        crmService.Setup(o => o.UpdateBonusTncAcceptanceAsync(bonusTncAcceptance, It.IsAny<CancellationToken>())).ReturnsAsync(true);

        var result = (OkObjectResult)await target.UpdateBonusTncAcceptance(bonusTncAcceptance, ct);

        result.Value.Should().BeEquivalentTo(new { updated = true });
    }

    [Fact]
    public async Task ShouldDropBonusOffer()
    {
        var dropBonusOffer = new DropBonusOffer
        {
            BonusId = "test",
            Reason = "reason",
            AgentName = "agent",
        };

        crmService.Setup(o => o.DropBonusOfferAsync(dropBonusOffer, It.IsAny<CancellationToken>())).ReturnsAsync(true);

        var result = (OkObjectResult)await target.DropBonusOffer(dropBonusOffer, ct);

        result.Value.Should().BeEquivalentTo(new { dropped = true });
    }
}
