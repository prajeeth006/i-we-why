using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.RememberMe;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.RememberMe;

public class RememberMeConfigurationTests
{
    [Theory]
    [InlineData(1, true)]
    [InlineData(12, true)]
    [InlineData(0, false)]
    [InlineData(-1, false)]
    public void Expiration_ShouldBeValid_IfPositive(int expirationSeconds, bool expectedValid)
    {
        var config = new RememberMeConfiguration
        {
            IsEnabled = true,
            ApiHost = new HttpUri("http://www.bwin.com"),
            Expiration = TimeSpan.FromSeconds(expirationSeconds),
        };

        var errors = new List<ValidationResult>();
        Validator.TryValidateObject(config, new ValidationContext(config), errors, true);

        if (expectedValid)
            errors.Should().BeEmpty();
        else
            errors.Single().MemberNames.Should().Equal(nameof(config.Expiration));
    }
}
