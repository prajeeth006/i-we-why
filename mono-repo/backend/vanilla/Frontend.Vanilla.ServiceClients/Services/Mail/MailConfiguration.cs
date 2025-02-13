using System;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Mail;

/// <summary>
/// The implementation of <see cref="IMailConfiguration" />.
/// </summary>
public sealed class MailConfigurationBuilder : IConfigurationBuilder<IMailConfiguration>
{
    /// <summary>
    /// Gets or sets the endpoint of the Mail Service.
    /// </summary>
    [Required, HttpHostUrl]
    public Uri EndpointAddress { get; set; }

    /// <summary>
    /// Gets or sets the SMTP farm.
    /// </summary>
    public string SmtpFarm { get; set; }

    /// <summary>
    /// Builds the configuration.
    /// </summary>
    IMailConfiguration IConfigurationBuilder<IMailConfiguration>.Build() => new MailConfiguration(this);
}

/// <summary>
/// Mail service configuration model.
/// </summary>
internal interface IMailConfiguration
{
    /// <summary>
    /// Gets the endpoint of the Mail Service.
    /// </summary>
    Uri EndpointAddress { get; }

    /// <summary>
    /// Gets the SMTP farm.
    /// </summary>
    string SmtpFarm { get; }
}

internal sealed class MailConfiguration : IMailConfiguration
{
    public Uri EndpointAddress { get; }
    public string SmtpFarm { get; }

    public MailConfiguration(MailConfigurationBuilder builder)
    {
        builder.Validate();

        EndpointAddress = builder.EndpointAddress;
        SmtpFarm = builder.SmtpFarm;
    }
}
