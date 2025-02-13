#nullable enable

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Features.DomainSpecificActions.Configuration;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DomainSpecificActions.Configuration;

public class DsaConfigurationDtoTests
{
    [Fact]
    public void ShouldBeInvalid_IfInvalidPlaceholderNames()
    {
        var target = new DsaConfigurationDto
        {
            HtmlDocumentPlaceholders = new Dictionary<string, string?>
            {
                { "${name}", "Bond" },
                { "${first name  }", "James" },
                { "${empty}", "" },
                { "${null}", null },
                { "wtf", "whatever" },
                { "{missingDollar}", "whatever" },
            },
        };

        // Act
        var errors = target.Validate(new ValidationContext(target)).ToList();

        errors.Should().HaveCount(2);
        Verify(0, "'wtf'");
        Verify(1, "'{missingDollar}'");

        void Verify(int i, string expected)
        {
            errors[i].ErrorMessage.Should().ContainAll(expected, @"'\$\{.*?\}'");
            errors[i].MemberNames.Should().Equal(nameof(target.HtmlDocumentPlaceholders));
        }
    }
}
