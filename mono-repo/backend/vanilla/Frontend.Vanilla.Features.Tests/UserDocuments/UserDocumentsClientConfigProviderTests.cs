using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.UserDocuments;
using Frontend.Vanilla.Testing.AbstractTests;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.UserDocuments;

public class UserDocumentsClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly IUserDocumentsConfiguration userDocumentsConfig;

    public UserDocumentsClientConfigProviderTests()
    {
        userDocumentsConfig = new UserDocumentsConfiguration(true, new Dictionary<string, string[]>(), 1m, TimeSpan.Zero);
        Target = new UserDocumentsClientConfigProvider(userDocumentsConfig);
    }

    [Fact]
    public async Task ShouldReturnBalanceConfig()
    {
        var config = await Target.GetClientConfigAsync(Ct);

        config.Should().BeEquivalentTo(new { DepositLimitNoticeThreshold = 1 });
    }
}
