using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.DomainSpecificLanguage;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DomainSpecificLanguage;

public class DomainSpecificLanguageClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IDslConfiguration> dslConfiguration;

    public DomainSpecificLanguageClientConfigProviderTests()
    {
        dslConfiguration = new Mock<IDslConfiguration>();
        Target = new DomainSpecificLanguageClientConfigProvider(dslConfiguration.Object);
    }

    [Fact]
    public async Task ShouldReturnDepositPromptConfig()
    {
        var defaultValues = new Dictionary<string, object> { { "teste", -1 } };
        dslConfiguration.SetupGet(c => c.DefaultValuesUnregisteredProvider).Returns(defaultValues);

        var config = await Target_GetConfigAsync();

        config["defaultValuesUnregisteredProvider"].Should().Be(defaultValues);
    }
}
