using System.Collections.Generic;
using System.Linq;
using System.Text;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Vanilla.Testing.AbstractTests;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Configuration.DynaCon;

public class DynaConServicesTests : VanillaFeatureServicesTestsBase
{
    private readonly HashSet<string> expectedProviderNames =
    [
        "Country", "Culture", "DeviceType", "NativeApp", "OperatingSystem", "UserAgent", "ShopCountry", "HeaderProduct", "User", "Jurisdiction", "AppContext", "Request"
    ];

    public static object TestCases => new DependencyInjectionTestCases
    {
        ServiceImpls = new[]
        {
            (typeof(ICurrentTenantResolver), typeof(CurrentLabelTenantResolver)),
            (typeof(ITenantSettingsFactory), typeof(MultitenantSettingsFactory)),
        },
    }.GetTestCases();

    [Fact]
    public void ShouldResolveDynaConProviders()
    {
        var providers = Provider.GetServices<IDynaConVariationContextProvider>();
        var providerNames = providers.Select(p => p.Name.Value).ToHashSet();

        var missingNames = expectedProviderNames.Where(n => !providerNames.Contains(n)).ToArray();
        var extraNames = providerNames.Where(n => !expectedProviderNames.Contains(n)).ToArray();

        var messageBuilder = new StringBuilder();

        if (missingNames.Any())
        {
            messageBuilder.AppendLine("there are missing names: ").AppendLine(string.Join(", ", missingNames));
        }

        if (extraNames.Any())
        {
            if (missingNames.Any())
            {
                messageBuilder.AppendLine(" and ");
            }

            messageBuilder.AppendLine("there are additional names: ").AppendLine(string.Join(", ", extraNames));
        }

        (!missingNames.Any() && !extraNames.Any()).Should().BeTrue(messageBuilder.ToString());
    }
}
