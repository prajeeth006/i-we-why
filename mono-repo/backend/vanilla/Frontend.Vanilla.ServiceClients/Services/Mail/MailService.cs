using System;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.ServiceModel;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.ServiceClients.Services.Mail;

/// <summary>
/// Implements minimalistic email capability configurable using <see cref="IMailConfiguration" />.
/// </summary>
public interface IMailService
{
    /// <summary>
    /// Sends an email. Returns <see langword="true"/> if sending was successfully, otherwise <see langword="false"/>.
    /// </summary>
    bool SendEmail(MailMessage emailMessage);
}

internal sealed class MailService<TClient>(IMailConfiguration config, Func<TClient> clientFactory, ILogger<MailService<TClient>> log)
    : IMailService
    where TClient : ICommunicationObject, EmailServicePort
{
    /// <summary>
    /// Sends an email.
    /// </summary>
    /// <param name="emailMessage">The email message to send.</param>
    /// <returns><see langword="true"/> if sending was successfully, otherwise <see langword="false"/>.</returns>
    public bool SendEmail(MailMessage emailMessage)
    {
        Guard.NotNull(emailMessage, nameof(emailMessage));

        var header = new SendEmailRequestHeaderType { PreferredSmtpFarm = config.SmtpFarm ?? "" };
        var emailRequest = CreateRequestFrom(emailMessage);
        var inValue = new SendEmailRequest
        {
            SendEmailRequestHeader = header,
            SendEmailRequestBody = emailRequest,
        };

        var client = clientFactory.Invoke();

        try
        {
            var response = client.SendEmail(inValue);
            client.Close();

            return response?.SendEmailResponseBody.MessageId != null;
        }
        catch (Exception ex)
        {
            if (ex is FaultException or TimeoutException)
            {
                log.LogError(ex, "Failed sending {@emailRequest}", emailRequest);

                client.Abort();

                return false;
            }

            throw;
        }
    }

    /// <summary>
    /// Creates the email request from a standard System.Net.Mail.<see cref="System.Net.Mail.MailMessage"/>.
    /// </summary>
    /// <param name="emailMessage">A filled out System.Net.Mail.<see cref="System.Net.Mail.MailMessage"/>.</param>
    /// <returns>A <see cref="SendEmailRequestType"/> to be send as an email.</returns>
    private static SendEmailRequestType CreateRequestFrom(MailMessage emailMessage)
    {
        return new SendEmailRequestType
        {
            From = emailMessage.From?.Address,
            To = emailMessage.To.Select(e => e.Address).ToArray(),
            Subject = emailMessage.Subject,
            Priority = (int)emailMessage.Priority,
            ReplyTo = emailMessage.ReplyToList.Select(r => r.Address).FirstOrDefault(),
            Cc = emailMessage.CC.Select(c => c.Address).ToArray(),
            Bcc = emailMessage.Bcc.Select(c => c.Address).ToArray(),
            Body = emailMessage.Body,
            IsBodyHtml = emailMessage.IsBodyHtml,
            Attachments = emailMessage.Attachments
                .Select(ConvertAttachment)
                .Where(attachment => attachment != null).ToArray(),
            AlternateViews = emailMessage.AlternateViews
                .Select(ConvertAlternateView)
                .Where(view => view != null).ToArray(),
        };
    }

    /// <summary>
    /// Converts a System.Net.Mail.<see cref="System.Net.Mail.AlternateView"/> to the code-generated <see cref="Frontend.Vanilla.ServiceClients.Services.Mail.AlternateView"/>.
    /// </summary>
    /// <param name="alternateView">A System.Net.Mail.<see cref="System.Net.Mail.AlternateView"/>.</param>
    /// <returns>A .<see cref="Frontend.Vanilla.ServiceClients.Services.Mail.AlternateView"/>.</returns>
    private static AlternateView ConvertAlternateView(System.Net.Mail.AlternateView alternateView)
    {
        var oldPosition = alternateView.ContentStream.Position;

        try
        {
            return new AlternateView
            {
                Content = new StreamReader(alternateView.ContentStream).ReadToEnd(),
                MediaType = alternateView.ContentType.Name,
            };
        }
        catch (IOException)
        {
            return null;
        }
        finally
        {
            if (alternateView.ContentStream.CanSeek)
                alternateView.ContentStream.Seek(oldPosition, SeekOrigin.Begin);
        }
    }

    /// <summary>
    /// Converts a <see cref="System.Net.Mail.Attachment"/> to the code-generated <see cref="Frontend.Vanilla.ServiceClients.Services.Mail.Attachment"/>.
    /// </summary>
    /// <param name="attachment">A System.Net.Mail.<see cref="System.Net.Mail.Attachment"/>.</param>
    /// <returns>A <see cref="Frontend.Vanilla.ServiceClients.Services.Mail.Attachment"/>.</returns>
    private static Attachment ConvertAttachment(System.Net.Mail.Attachment attachment)
    {
        var oldPosition = attachment.ContentStream.Position;

        try
        {
            var data = new MemoryStream((int)attachment.ContentStream.Length);
            attachment.ContentStream.CopyTo(data);

            return new Attachment { Data = data.ToArray(), FileName = attachment.Name };
        }
        catch (IOException)
        {
            return null;
        }
        finally
        {
            if (attachment.ContentStream.CanSeek)
                attachment.ContentStream.Seek(oldPosition, SeekOrigin.Begin);
        }
    }
}
