using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.ServiceClients.Services.Mail;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Mail;

public sealed class MailConfigurationTests
{
    [Fact]
    public void ShouldCopyAllProperties()
    {
        IConfigurationBuilder<IMailConfiguration> builder = new MailConfigurationBuilder
        {
            EndpointAddress = new Uri("http://smtp.gmail.com/"),
            SmtpFarm = "Old MacDonald 's Farm",
        };

        var config = builder.Build(); // Act

        config.EndpointAddress.Should().Be(new Uri("http://smtp.gmail.com/"));
        config.SmtpFarm.Should().Be("Old MacDonald 's Farm");
    }
}
